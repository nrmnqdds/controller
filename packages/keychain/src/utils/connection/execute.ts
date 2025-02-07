import { ResponseCodes, ConnectError, toArray } from "@cartridge/controller";
import {
  Abi,
  AllowArray,
  Call,
  CallData,
  InvocationsDetails,
  InvokeFunctionResponse,
  addAddressPadding,
} from "starknet";
import { ConnectionCtx, ControllerError, ExecuteCtx } from "./types";
import { ErrorCode, JsCall } from "@cartridge/account-wasm/controller";
import { mutex } from "./sync";
import Controller from "../controller";

export const ESTIMATE_FEE_PERCENTAGE = 10;

export function parseControllerError(
  controllerError: ControllerError,
): ControllerError {
  try {
    const data = JSON.parse(controllerError.data);
    return {
      code: controllerError.code,
      message: controllerError.message,
      data,
    };
  } catch {
    return {
      code: controllerError.code,
      message: controllerError.message,
      data: { execution_error: controllerError.data },
    };
  }
}

export function execute({
  setContext,
}: {
  setContext: (context: ConnectionCtx) => void;
}) {
  return async (
    transactions: AllowArray<Call>,
    __?: Abi[],
    ___?: InvocationsDetails,
    sync?: boolean,
    _?: unknown,
    error?: ControllerError,
  ): Promise<InvokeFunctionResponse | ConnectError> => {
    const controller: Controller | undefined = window.controller;
    const calls = normalizeCalls(transactions);

    if (sync) {
      return await new Promise((resolve, reject) => {
        setContext({
          type: "execute",
          transactions,
          error,
          resolve,
          reject,
        } as ExecuteCtx);
      });
    }

    const release = await mutex.obtain();
    return await new Promise<InvokeFunctionResponse | ConnectError>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!controller) {
          return reject({
            message: "Controller context not available",
          });
        }

        // If a session call and there is no session available
        // fallback to manual apporval flow
        if (!(await controller.hasSession(calls))) {
          setContext({
            type: "execute",
            transactions,
            resolve,
            reject,
          } as ExecuteCtx);

          return resolve({
            code: ResponseCodes.USER_INTERACTION_REQUIRED,
            message: "User interaction required",
          });
        }

        // Try paymaster if it is enabled. If it fails, fallback to user pays session flow.
        try {
          const { transaction_hash } =
            await controller.executeFromOutsideV3(calls);

          return resolve({
            code: ResponseCodes.SUCCESS,
            transaction_hash,
          });
        } catch (e) {
          // User only pays if the error is ErrorCode.PaymasterNotSupported
          const error = e as ControllerError;
          if (error.code !== ErrorCode.PaymasterNotSupported) {
            setContext({
              type: "execute",
              transactions,
              error: parseControllerError(error),
              resolve,
              reject,
            } as ExecuteCtx);
            return resolve({
              code: ResponseCodes.ERROR,
              message: error.message,
              error: parseControllerError(error),
            });
          }
        }

        try {
          const estimate = await controller.estimateInvokeFee(calls);
          const { transaction_hash } = await controller.execute(
            transactions as Call[],
            estimate,
          );

          return resolve({
            code: ResponseCodes.SUCCESS,
            transaction_hash,
          });
        } catch (e) {
          console.log(e);
          setContext({
            type: "execute",
            transactions,
            error: parseControllerError(e as ControllerError),
            resolve,
            reject,
          } as ExecuteCtx);
          return resolve({
            code: ResponseCodes.ERROR,
            message: (e as Error).message,
            error: parseControllerError(e as ControllerError),
          });
        }
      },
    ).finally(() => {
      setContext(undefined);
      release();
    });
  };
}

export const normalizeCalls = (calls: AllowArray<Call>): JsCall[] => {
  return toArray(calls).map((call: Call) => {
    return {
      entrypoint: call.entrypoint,
      contractAddress: addAddressPadding(call.contractAddress),
      calldata: CallData.toHex(call.calldata),
    };
  });
};
