use std::time::Duration;

use crate::{
    abigen::erc_20::Erc20,
    artifacts::{Version, CONTROLLERS},
    controller::Controller,
    signers::Signer,
    tests::{
        account::FEE_TOKEN_ADDRESS, runners::katana::KatanaRunner,
        transaction_waiter::TransactionWaiter,
    },
};
use cainome::cairo_serde::{ContractAddress, U256};
use starknet::{accounts::Account, macros::felt, providers::Provider, signers::SigningKey};
use starknet_crypto::Felt;

#[tokio::test]
async fn test_deploy_controller() {
    let runner = KatanaRunner::load();
    dbg!(runner.declare_controller(Version::V1_0_4).await);

    // Create signers
    let owner = Signer::Starknet(SigningKey::from_secret_scalar(felt!(
        "0x3e5e410f88f88e77d18a168259a8feb6a68b358c813bdca08c875c8e54d0bf2"
    )));

    let provider = runner.client();
    let chain_id = provider.chain_id().await.unwrap();

    // Create a new Controller instance
    let username = "testuser".to_string();

    // This is only done to calculate the address
    // The code duplication allows for the address not to be hardcoded
    let address = Controller::new(
        "app_id".to_string(),
        username.clone(),
        CONTROLLERS[&Version::V1_0_4].hash,
        runner.rpc_url.clone(),
        owner.clone(),
        Felt::ZERO,
        chain_id,
    )
    .deploy()
    .address();

    let controller = Controller::new(
        "app_id".to_string(),
        username.clone(),
        CONTROLLERS[&Version::V1_0_4].hash,
        runner.rpc_url.clone(),
        owner.clone(),
        address,
        chain_id,
    );

    let deploy = controller.deploy();
    assert_eq!(address, deploy.address());

    runner.fund(&address).await;

    // Deploy the controller
    let deploy_result = deploy.fee_estimate_multiplier(1.5).send().await.unwrap();

    // Wait for the transaction to be mined
    TransactionWaiter::new(deploy_result.transaction_hash, &provider.clone())
        .with_timeout(Duration::from_secs(5))
        .wait()
        .await
        .unwrap();

    // Verify the deployment
    let deployed_address = controller.address();
    assert_eq!(
        deployed_address, address,
        "Deployed address doesn't match expected address"
    );
}

#[tokio::test]
async fn test_controller_nonce_mismatch_recovery() {
    let username = "testuser".to_string();
    let signer = Signer::new_starknet_random();

    let runner = KatanaRunner::load();
    let mut controller1 = runner
        .deploy_controller(username.clone(), signer.clone(), Version::LATEST)
        .await;

    let chain_id = runner.client().chain_id().await.unwrap();

    // Create the second controller with the same credentials and address
    let mut controller2 = Controller::new(
        "app_id".to_string(),
        username.clone(),
        controller1.class_hash,
        runner.rpc_url.clone(),
        signer.clone(),
        controller1.address,
        chain_id,
    );

    // Send a transaction using controller1
    let recipient = ContractAddress(felt!("0x18301129"));
    let amount = U256 { low: 0, high: 0 };
    let erc20 = Erc20::new(*FEE_TOKEN_ADDRESS, &controller1);

    let tx1 = erc20.transfer_getcall(&recipient, &amount);
    let max_fee = controller1
        .estimate_invoke_fee(vec![tx1.clone()])
        .await
        .unwrap();
    let res = Controller::execute(&mut controller1, vec![tx1.clone()], max_fee.overall_fee)
        .await
        .unwrap();

    TransactionWaiter::new(res.transaction_hash, runner.client())
        .wait()
        .await
        .unwrap();

    // Now send a transaction using controller2, which should have a stale nonce
    let erc20 = Erc20::new(*FEE_TOKEN_ADDRESS, &controller2);
    let tx2 = erc20.transfer_getcall(&recipient, &amount);

    let tx2_result =
        Controller::execute(&mut controller2, vec![tx2.clone()], max_fee.overall_fee).await;

    // Verify that it succeeds after recovering from nonce mismatch
    assert!(
        tx2_result.is_ok(),
        "Controller did not recover from nonce mismatch: {:?}",
        tx2_result.err()
    );

    TransactionWaiter::new(tx2_result.unwrap().transaction_hash, runner.client())
        .wait()
        .await
        .unwrap();

    let res = Controller::execute(&mut controller1, vec![tx1], max_fee.overall_fee)
        .await
        .unwrap();

    TransactionWaiter::new(res.transaction_hash, runner.client())
        .wait()
        .await
        .unwrap();

    let tx2_result = Controller::execute(&mut controller2, vec![tx2], max_fee.overall_fee).await;

    // Verify that it succeeds after recovering from nonce mismatch
    assert!(
        tx2_result.is_ok(),
        "Controller did not recover from nonce mismatch: {:?}",
        tx2_result.err()
    );
}
