import {
  constants,
  TransactionExecutionStatus,
  TransactionFinalityStatus,
} from "starknet";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutContainer,
  LayoutFooter,
  LayoutContent,
  CheckIcon,
  ExternalIcon,
  Spinner,
  WandIcon,
  Button,
  LayoutHeader,
} from "@cartridge/ui-next";
import { Funding } from "./funding";
import { useConnection } from "@/hooks/connection";
import { ControllerErrorAlert, ErrorAlert } from "./ErrorAlert";
import { useDeploy } from "@/hooks/deploy";
import { Fees } from "./Fees";
import { ControllerError } from "@/utils/connection";
import { TransactionSummary } from "@/components/transaction/TransactionSummary";
import { ETH_CONTRACT_ADDRESS, useERC20Balance } from "@cartridge/utils";
import { Link } from "react-router-dom";

export function DeployController({
  onClose,
  ctrlError,
}: {
  onClose: () => void;
  ctrlError?: ControllerError;
}) {
  const { closeModal, chainId, controller, chainName, hasPrefundRequest } =
    useConnection();
  const { deploySelf, isDeploying } = useDeploy();
  const [deployHash, setDeployHash] = useState<string>();
  const [error, setError] = useState<Error>();
  const [accountState, setAccountState] = useState<
    "fund" | "deploy" | "deploying" | "deployed"
  >("fund");
  const feeEstimate: string | undefined =
    ctrlError?.data?.fee_estimate.overall_fee;

  useEffect(() => {
    if (
      !controller ||
      controller.chainId() !== constants.StarknetChainId.SN_MAIN ||
      !hasPrefundRequest ||
      !feeEstimate
    ) {
      return;
    }

    setAccountState("deploy");
  }, [controller, hasPrefundRequest, feeEstimate]);

  useEffect(() => {
    if (deployHash && controller) {
      controller
        .waitForTransaction(deployHash, {
          retryInterval: 1000,
          successStates: [
            TransactionExecutionStatus.SUCCEEDED,
            TransactionFinalityStatus.ACCEPTED_ON_L2,
          ],
        })
        .then(() => setAccountState("deployed"))
        .catch((e) => setError(e));
    }
  }, [deployHash, controller]);

  const {
    data: [eth],
    isLoading,
  } = useERC20Balance({
    address: controller?.address,
    contractAddress: ETH_CONTRACT_ADDRESS,
    provider: controller,
    interval: 3000,
    decimals: 2,
  });
  useEffect(() => {
    if (!feeEstimate || accountState != "fund" || !eth?.balance.value) return;

    if (eth.balance.value >= BigInt(feeEstimate)) {
      setAccountState("deploy");
    } else {
      setAccountState("fund");
    }
  }, [eth?.balance.value, feeEstimate, accountState]);

  const onDeploy = useCallback(async () => {
    if (!feeEstimate) return;

    try {
      const hash = await deploySelf(feeEstimate);
      setDeployHash(hash);
    } catch (e) {
      if (e instanceof Error && e.message.includes("DuplicateTx")) {
        return;
      }
      setError(e as Error);
    }
  }, [deploySelf, feeEstimate]);

  if (isLoading) {
    return (
      <LayoutContainer>
        <LayoutHeader
          variant="expanded"
          title="Checking account balance..."
          icon={<Spinner size="xl" />}
          closeModal={closeModal}
          chainId={chainId}
        />
      </LayoutContainer>
    );
  }

  switch (accountState) {
    case "fund":
      return (
        <Funding
          title={
            <>
              Fund{" "}
              <b style={{ color: "brand.primary" }}>{controller?.username()}</b>{" "}
              for deployment
            </>
          }
          onComplete={() => {
            setAccountState("deploy");
          }}
        />
      );
    case "deploy":
      return (
        <LayoutContainer>
          <LayoutHeader
            variant="expanded"
            icon={<WandIcon variant="line" size="lg" />}
            title="Deploy Controller"
            description="This will initialize your controller on the new network"
            closeModal={closeModal}
            chainId={chainId}
          />
          <LayoutContent>
            <TransactionSummary
              calls={[
                {
                  entrypoint: "deploy",
                  contractAddress:
                    "0x24a9edbfa7082accfceabf6a92d7160086f346d622f28741bf1c651c412c9ab",
                },
              ]}
            />
          </LayoutContent>

          <LayoutFooter>
            {error ? (
              <ErrorAlert
                title="Something went wrong"
                description={error.message}
              />
            ) : (
              feeEstimate && <Fees maxFee={BigInt(feeEstimate)} />
            )}
            <Button onClick={onDeploy} isLoading={isDeploying}>
              DEPLOY
            </Button>
          </LayoutFooter>
        </LayoutContainer>
      );
    case "deploying":
      return (
        <LayoutContainer>
          <LayoutHeader
            variant="expanded"
            icon={<Spinner size="xl" />}
            title="Deploying Controller"
            description={`Your controller is being deployed on ${chainName}`}
            closeModal={closeModal}
            chainId={chainId}
          />
          <LayoutContent>
            {deployHash && controller && (
              <ExplorerLink
                chainId={controller.chainId()}
                txHash={deployHash}
              />
            )}
          </LayoutContent>
          <LayoutFooter>
            {error ? (
              <ErrorAlert
                title="Something went wrong"
                description={error.message}
              />
            ) : !deployHash && ctrlError ? (
              <ControllerErrorAlert error={ctrlError} />
            ) : null}
            <Button onClick={onDeploy} isLoading={isDeploying}>
              continue
            </Button>
          </LayoutFooter>
        </LayoutContainer>
      );
    case "deployed":
      return (
        <LayoutContainer>
          <LayoutHeader
            variant="expanded"
            Icon={CheckIcon}
            title="Success!"
            description={`Your controller has been deployed on ${chainName}`}
            closeModal={closeModal}
            chainId={chainId}
          />
          <LayoutContent className="items-center">
            {deployHash && controller && (
              <ExplorerLink
                chainId={controller.chainId()}
                txHash={deployHash}
              />
            )}
          </LayoutContent>
          <LayoutFooter>
            {error ? (
              <ErrorAlert
                title="Something went wrong"
                description={error.message}
              />
            ) : !deployHash && ctrlError ? (
              <ControllerErrorAlert error={ctrlError} />
            ) : null}
            <Button onClick={onClose}>continue</Button>
          </LayoutFooter>
        </LayoutContainer>
      );
  }
}

function ExplorerLink({
  txHash,
  chainId,
}: {
  txHash: string;
  chainId: string;
}) {
  if (
    ![
      constants.StarknetChainId.SN_SEPOLIA,
      constants.StarknetChainId.SN_MAIN,
    ].includes(chainId as constants.StarknetChainId)
  ) {
    return null;
  }

  return (
    <Link
      to={`https://${
        chainId === constants.StarknetChainId.SN_SEPOLIA ? "sepolia." : ""
      }starkscan.co/tx/${txHash}`}
      target="_blank"
      className="flex items-center gap-1 text-sm text-muted-foreground underline"
    >
      View on Starkscan
      <ExternalIcon size="sm" />
    </Link>
  );
}
