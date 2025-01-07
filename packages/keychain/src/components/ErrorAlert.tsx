import {
  CopyIcon,
  CheckIcon,
  ErrorAlertIcon,
  ErrorAlertIconProps,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  cn,
} from "@cartridge/ui-next";
import { Text, HStack, VStack, Divider } from "@chakra-ui/react";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ErrorCode } from "@cartridge/account-wasm/controller";
import { ControllerError } from "@/utils/connection";
import { parseExecutionError, parseValidationError } from "@/utils/errors";
import { formatAddress } from "@cartridge/utils";
import { Link } from "react-router-dom";
import { useExplorer } from "@starknet-react/core";

export function ErrorAlert({
  title,
  description,
  variant = "error",
  isExpanded = false,
  allowToggle = false,
  copyText,
}: {
  title: string;
  description?: string | ReactElement;
  variant?: string;
  isExpanded?: boolean;
  allowToggle?: boolean;
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copied]);

  const collapsible = !isExpanded || allowToggle;
  const styles = useMemo(() => {
    switch (variant) {
      case "info":
        return { bg: "bg-info", text: "text-info-foreground" };
      case "warning":
        return { bg: "bg-warning", text: "text-warning-foreground" };
      case "error":
        return { bg: "bg-error", text: "text-error-foreground" };
      default:
        return { bg: "bg-secondary", text: "text-secondary-foreground" };
    }
  }, [variant]);

  return (
    <Accordion
      type="single"
      collapsible={collapsible}
      defaultValue={isExpanded ? "item-1" : undefined}
    >
      <AccordionItem
        value="item-1"
        className={cn(
          "flex flex-col rounded p-3 gap-3",
          styles.bg,
          styles.text,
        )}
      >
        <AccordionTrigger hideIcon={!collapsible} className="items-start gap-1">
          {variant && variant !== "default" && (
            <div className="w-5">
              <ErrorAlertIcon
                variant={variant as ErrorAlertIconProps["variant"]}
              />
            </div>
          )}
          <div className={cn("text-2xs font-bold uppercase", styles.text)}>
            {title}
          </div>
        </AccordionTrigger>

        <AccordionContent>
          {copyText && (
            <Button
              size="icon"
              variant="icon"
              className="absolute right-5 w-5 h-5 bg-[rgba(0,0,0,0.1)]"
              onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(copyText);
              }}
            >
              {copied ? (
                <CheckIcon size="xs" className="text-[black]" />
              ) : (
                <CopyIcon size="xs" className="text-[black]" />
              )}
            </Button>
          )}
          {description && <div className="text-xs mr-7">{description}</div>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function ControllerErrorAlert({
  error,
  isPaymaster = false,
}: {
  error: ControllerError | Error;
  isPaymaster?: boolean;
}) {
  let title = "An error occurred";
  let description: string | React.ReactElement = error.message;
  let isExpanded = false;
  let variant = "error";
  let copyText: string | undefined;

  if (!isControllerError(error)) {
    title = "Unknown error";
    description = error.message;

    return (
      <ErrorAlert
        title={title}
        description={description}
        variant={variant}
        isExpanded={isExpanded}
        copyText={copyText}
      />
    );
  }

  switch (error.code) {
    case ErrorCode.SignError:
      title = "Signing Error";
      if (error.message.includes("Get assertion error")) {
        description =
          "The authentication request timed out or was cancelled. Please try again.";
      }

      break;
    case ErrorCode.StorageError:
      title = "Storage Error";
      break;
    case ErrorCode.AccountFactoryError:
      title = "Account Creation Error";
      break;
    case ErrorCode.CartridgeControllerNotDeployed:
      title = "Your Controller is not deployed";
      description =
        "Lets fund your Controller and deploy it before we can start executing transactions.";
      isExpanded = true;
      variant = "warning";
      break;
    case ErrorCode.InsufficientBalance:
      title = "Insufficient funds";
      description =
        "Your controller does not have enough gas to complete this transaction";
      isExpanded = true;
      variant = "warning";
      break;
    case ErrorCode.OriginError:
      title = "Origin Error";
      break;
    case ErrorCode.EncodingError:
      title = "Encoding Error";
      break;
    case ErrorCode.SerdeWasmBindgenError:
      title = "Serialization Error";
      break;
    case ErrorCode.CairoSerdeError:
      title = "Cairo Serialization Error";
      break;
    case ErrorCode.CairoShortStringToFeltError:
      title = "Cairo String Conversion Error";
      break;
    case ErrorCode.DeviceCreateCredential:
    case ErrorCode.DeviceGetAssertion:
    case ErrorCode.PaymasterExecutionTimeNotReached:
      title = "Paymaster Execution Time Not Reached";
      break;
    case ErrorCode.PaymasterExecutionTimePassed:
      title = "Paymaster Execution Time Passed";
      break;
    case ErrorCode.PaymasterInvalidCaller:
      title = "Invalid Paymaster Caller";
      break;
    case ErrorCode.PaymasterRateLimitExceeded:
      title = "Paymaster Rate Limit Exceeded";
      break;
    case ErrorCode.PaymasterNotSupported:
      title = "Paymaster Not Supported";
      break;
    case ErrorCode.PaymasterHttp:
      title = "Paymaster HTTP Error";
      break;
    case ErrorCode.PaymasterExcecution:
      title = "Paymaster Execution Error";
      break;
    case ErrorCode.PaymasterSerialization:
      title = "Paymaster Serialization Error";
      break;
    case ErrorCode.DeviceBadAssertion:
    case ErrorCode.DeviceChannel:
    case ErrorCode.DeviceOrigin:
      title = "Device Error";
      break;
    case ErrorCode.AccountSigning:
    case ErrorCode.AccountProvider:
    case ErrorCode.AccountClassHashCalculation:
    case ErrorCode.AccountClassCompression:
    case ErrorCode.AccountFeeOutOfRange:
      title = "Account Error";
      break;
    case ErrorCode.ProviderRateLimited:
    case ErrorCode.ProviderArrayLengthMismatch:
    case ErrorCode.ProviderOther:
      title = "Provider Error";
      break;
    case ErrorCode.PolicyChainIdMismatch:
      title = "Invalid Policy";
      break;
    // Starknet errors
    case ErrorCode.StarknetFailedToReceiveTransaction:
    case ErrorCode.StarknetContractNotFound:
    case ErrorCode.StarknetClassHashNotFound:
    case ErrorCode.StarknetTransactionHashNotFound:
    case ErrorCode.StarknetNoBlocks:
    case ErrorCode.StarknetInvalidContinuationToken:
    case ErrorCode.StarknetTooManyKeysInFilter:
    case ErrorCode.StarknetContractError:
    case ErrorCode.StarknetClassAlreadyDeclared:
    case ErrorCode.StarknetInvalidTransactionNonce:
    case ErrorCode.StarknetInsufficientMaxFee:
    case ErrorCode.StarknetInsufficientAccountBalance:
    case ErrorCode.StarknetCompilationFailed:
    case ErrorCode.StarknetContractClassSizeIsTooLarge:
    case ErrorCode.StarknetNonAccount:
    case ErrorCode.StarknetDuplicateTx:
    case ErrorCode.StarknetCompiledClassHashMismatch:
    case ErrorCode.StarknetUnsupportedTxVersion:
    case ErrorCode.StarknetUnsupportedContractClassVersion:
    case ErrorCode.StarknetNoTraceAvailable:
      title = "Starknet Error";
      break;
    case ErrorCode.StarknetUnexpectedError:
      title = "Unexpected Error";
      description = error.data?.reason || JSON.stringify(error);
      break;
    case ErrorCode.StarknetTransactionExecutionError:
      try {
        const parsedError = parseExecutionError(error, isPaymaster ? 2 : 1);
        title = parsedError.summary;
        copyText = parsedError.raw;
        description = <StackTraceDisplay stackTrace={parsedError.stack} />;
      } catch {
        title = "Execution error";
        description = <Text color="inherit">{error.data}</Text>;
      }
      break;
    case ErrorCode.StarknetValidationFailure: {
      const parsedError = parseValidationError(error);
      title = parsedError.summary;
      copyText = parsedError.raw;
      description = (
        <VStack align="start" spacing={1} w="full">
          {Object.entries(parsedError.details).map(([key, value]) => (
            <Text
              key={key}
              wordBreak="break-all"
              color="inherit"
              textAlign="left"
            >
              {key}: {typeof value === "bigint" ? value.toString() : value}
            </Text>
          ))}
        </VStack>
      );
      variant = "warning";
      isExpanded = true;
      break;
    }
    default: {
      title = "Unknown Error";
      break;
    }
  }

  return (
    <ErrorAlert
      title={title}
      description={description}
      variant={variant}
      isExpanded={isExpanded}
      copyText={copyText}
    />
  );
}

function StackTraceDisplay({
  stackTrace,
}: {
  stackTrace: ReturnType<typeof parseExecutionError>["stack"];
}) {
  const explorer = useExplorer();
  const getExplorerUrl = useCallback(
    (key: "address" | "class", value: string) => {
      switch (key) {
        case "address":
          return explorer.contract(value);
        case "class":
          return explorer.class(value);
      }
    },
    [explorer],
  );

  return (
    <VStack align="start" spacing={2} w="full">
      {stackTrace.map((trace, i, arr) => (
        <React.Fragment key={i}>
          <VStack align="start" spacing={1} w="full">
            {Object.entries(trace).map(
              ([key, value]) =>
                value && (
                  <HStack
                    key={key}
                    w="full"
                    fontSize="xs"
                    alignItems="flex-start"
                  >
                    <Text
                      color="opacityBlack.700"
                      textTransform="capitalize"
                      w="80px"
                      flexShrink={0}
                    >
                      {key}
                    </Text>
                    {key === "address" || key === "class" ? (
                      <Link
                        to={getExplorerUrl(key, value as string)}
                        target="_blank"
                        className="break-all text-left hover:underline"
                      >
                        {formatAddress(value as string, {
                          size: "sm",
                        })}
                      </Link>
                    ) : key === "selector" ? (
                      <Text
                        wordBreak="break-all"
                        color="inherit"
                        textAlign="left"
                      >
                        {formatAddress(value as string, {
                          size: "sm",
                        })}
                      </Text>
                    ) : (
                      <VStack align="start" spacing={1} w="full">
                        {(value as string[]).map((line, index) => (
                          <Text
                            key={index}
                            wordBreak="break-all"
                            color="inherit"
                            textAlign="left"
                          >
                            {line}
                          </Text>
                        ))}
                      </VStack>
                    )}
                  </HStack>
                ),
            )}
          </VStack>
          {i !== arr.length - 1 && <Divider borderColor="darkGray.100" />}
        </React.Fragment>
      ))}
    </VStack>
  );
}

function isControllerError(
  error: ControllerError | Error,
): error is ControllerError {
  return !!(error as ControllerError).code;
}
