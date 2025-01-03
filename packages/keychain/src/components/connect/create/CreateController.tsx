import { useRef, useState } from "react";
import { Container, Footer, Content } from "@/components/layout";
import { Button } from "@cartridge/ui-next";
import { Box } from "@chakra-ui/react";
import { useControllerTheme } from "@/hooks/theme";
import { usePostHog } from "posthog-js/react";
import { useDebounce } from "@/hooks/debounce";
import { useUsernameValidation } from "./useUsernameValidation";
import { LoginMode } from "../types";
import { Legal, StatusTray } from ".";
import { useCreateController } from "./useCreateController";
import { ControllerTheme } from "@cartridge/presets";
import { Input } from "@cartridge/ui-next";

interface CreateControllerViewProps {
  theme: ControllerTheme;
  usernameField: {
    value: string;
    error?: string;
  };
  validation: ReturnType<typeof useUsernameValidation>;
  isLoading: boolean;
  error?: Error;
  onUsernameChange: (value: string) => void;
  onUsernameFocus: () => void;
  onUsernameClear: () => void;
  onSubmit: () => void;
}

export function CreateControllerView({
  theme,
  usernameField,
  validation,
  isLoading,
  error,
  onUsernameChange,
  onUsernameFocus,
  onUsernameClear,
  onSubmit,
}: CreateControllerViewProps) {
  return (
    <Container
      variant="expanded"
      title={
        theme.name === "cartridge"
          ? "Play with Controller"
          : `Play ${theme.name}`
      }
      description="Connect your Controller"
      hideNetwork
    >
      <form
        style={{ width: "100%" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <Content mb="2rem">
          <Box
            border={
              validation.status === "invalid" || error ? "1px solid" : "0px"
            }
            borderColor="red.500"
            borderRadius="base"
          >
            <Input
              {...usernameField}
              autoFocus
              placeholder="shinobi"
              onFocus={onUsernameFocus}
              onChange={(e) => {
                onUsernameChange(e.target.value.toLowerCase());
              }}
              isLoading={validation.status === "validating"}
              disabled={isLoading}
              onClear={onUsernameClear}
              style={{ position: "relative", zIndex: 1 }}
            />
          </Box>

          <StatusTray
            username={usernameField.value}
            validation={validation}
            error={error}
            style={{ position: "relative", zIndex: 0 }}
          />
        </Content>

        <Footer showCatridgeLogo>
          <Legal />

          <Button
            isLoading={isLoading}
            disabled={validation.status !== "valid"}
            onClick={onSubmit}
          >
            {validation.exists ? "login" : "sign up"}
          </Button>
        </Footer>
      </form>
    </Container>
  );
}

export function CreateController({
  isSlot,
  loginMode = LoginMode.Webauthn,
  onCreated,
}: {
  isSlot?: boolean;
  loginMode?: LoginMode;
  onCreated?: () => void;
  error?: Error;
}) {
  const posthog = usePostHog();
  const hasLoggedFocus = useRef(false);
  const hasLoggedChange = useRef(false);
  const theme = useControllerTheme();

  const [usernameField, setUsernameField] = useState({
    value: "",
    error: undefined,
  });

  const { debouncedValue: username } = useDebounce(usernameField.value, 100);
  const validation = useUsernameValidation(username);

  const { isLoading, error, setError, handleSubmit } = useCreateController({
    onCreated,
    isSlot,
    loginMode,
  });

  const handleUsernameChange = (value: string) => {
    if (!hasLoggedChange.current) {
      posthog?.capture("Change Username");
      hasLoggedChange.current = true;
    }
    setError(undefined);
    setUsernameField((u) => ({
      ...u,
      value,
      error: undefined,
    }));
  };

  const handleUsernameFocus = () => {
    if (!hasLoggedFocus.current) {
      posthog?.capture("Focus Username");
      hasLoggedFocus.current = true;
    }
  };

  const handleUsernameClear = () => {
    setError(undefined);
    setUsernameField((u) => ({ ...u, value: "" }));
  };

  const handleFormSubmit = () => {
    if (!usernameField.value) {
      return;
    }
    handleSubmit(usernameField.value, !!validation.exists);
  };

  return (
    <CreateControllerView
      theme={theme}
      usernameField={usernameField}
      validation={validation}
      isLoading={isLoading}
      error={error}
      onUsernameChange={handleUsernameChange}
      onUsernameFocus={handleUsernameFocus}
      onUsernameClear={handleUsernameClear}
      onSubmit={handleFormSubmit}
    />
  );
}
