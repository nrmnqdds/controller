import type { SignMessagePolicy } from "@cartridge/presets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  CheckboxIcon,
  PencilIcon,
  Switch,
  cn,
} from "@cartridge/ui-next";
import { ArrowTurnDownIcon, Badge } from "@cartridge/ui-next";
import type {
  StarknetEnumType,
  StarknetMerkleType,
} from "@starknet-io/types-js";
import { type PropsWithChildren, useCallback, useState } from "react";
import { AccordionCard } from "./AccordionCard";

interface MessageCardProps {
  messages: SignMessagePolicy[];
  isExpanded?: boolean;
}

export function MessageCard({ messages, isExpanded }: MessageCardProps) {
  const [tweakedMessages, setTweakedMessages] = useState(() =>
    messages.map((message) => ({
      ...message,
      enabled: true,
    })),
  );

  const handleToggle = useCallback(
    (index: number, enabled: boolean) => {
      setTweakedMessages((prev) =>
        prev.map((m, i) => (i === index ? { ...m, enabled } : m)),
      );
    },
    [setTweakedMessages],
  );

  return (
    <AccordionCard
      icon={<PencilIcon variant="solid" />}
      title="Sign Message"
      trigger={
        <div className="text-xs text-muted-foreground">
          Approve&nbsp;
          <span className="text-accent-foreground font-bold">
            {messages.length} {messages.length > 1 ? `messages` : "message"}
          </span>
        </div>
      }
      isExpanded={isExpanded}
    >
      <MessageContent messages={tweakedMessages} onToggle={handleToggle} />
    </AccordionCard>
  );
}

type MessagePolicyWithEnabled = SignMessagePolicy & { enabled: boolean };

export function MessageContent({
  messages,
  onToggle,
}: {
  messages: MessagePolicyWithEnabled[];
  onToggle: (index: number, enabled: boolean) => void;
}) {
  return (
    <>
      {messages.map((m, i) => (
        <div
          key={`${m.domain.name}-${i}`}
          className="flex flex-col bg-background-100 gap-2 text-xs"
        >
          <div className="flex flex-row items-center justify-between">
            <p
              className={cn(
                "py-2 font-bold",
                m.enabled ? "text-foreground" : "text-accent",
              )}
            >
              {m.name ?? `Message ${i + 1}`}
            </p>
            <Switch
              checked={m.enabled}
              onCheckedChange={(enabled) => onToggle(i, enabled)}
            />
          </div>

          <div className="flex flex-col gap-px rounded overflow-auto border border-background p-3">
            {/* Domain section */}
            {Object.values(m.domain).filter((f) => typeof f !== "undefined")
              .length > 0 && (
              <CollapsibleRow key="domain" title="domain" enabled={m.enabled}>
                {m.domain.name && (
                  <ValueRow
                    values={[
                      {
                        name: "name",
                        value: m.domain.name,
                      },
                    ]}
                    enabled={m.enabled}
                  />
                )}
              </CollapsibleRow>
            )}

            <ValueRow
              values={[
                {
                  name: "primaryType",
                  value: m.primaryType,
                },
              ]}
              enabled={m.enabled}
            />

            <CollapsibleRow title="types" enabled={m.enabled}>
              {Object.entries(m.types).map(([name, types]) => (
                <CollapsibleRow key={name} title={name} enabled={m.enabled}>
                  {types.map((t, typeIndex) => (
                    <ValueRow
                      key={`${t.name}-${typeIndex}`}
                      values={[
                        { name: "name", value: t.name },
                        { name: "type", value: t.type },
                        ...(["enum", "merkletree"].includes(t.name)
                          ? [
                              {
                                name: "contains",
                                value: (
                                  t as StarknetEnumType | StarknetMerkleType
                                ).contains,
                              },
                            ]
                          : []),
                      ]}
                      enabled={m.enabled}
                    />
                  ))}
                </CollapsibleRow>
              ))}
            </CollapsibleRow>
          </div>
        </div>
      ))}
    </>
  );
}

interface CollapsibleRowProps extends PropsWithChildren {
  title: string;
  enabled: boolean;
}

export function CollapsibleRow({
  title,
  children,
  enabled,
}: CollapsibleRowProps) {
  const [value, setValue] = useState("");

  return (
    <Accordion type="single" collapsible value={value} onValueChange={setValue}>
      <AccordionItem value={title} className="flex flex-col">
        <AccordionTrigger
          hideIcon
          className={cn(
            "hover:bg-accent rounded-md",
            enabled ? "text-muted-foreground" : "text-accent",
          )}
        >
          <div className="flex items-center gap-1 py-1">
            <CheckboxIcon
              variant={value ? "minus-line" : "plus-line"}
              size="sm"
            />
            <div className="text-xs">{title}</div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="ml-5 flex flex-col">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface ValueRowProps {
  values: { name: string; value: string | number }[];
  enabled: boolean;
}

export function ValueRow({ values, enabled }: ValueRowProps) {
  return (
    <div
      className={cn(
        "flex items-center py-1 gap-1 ",
        enabled ? "text-muted-foreground" : "text-accent",
      )}
    >
      <ArrowTurnDownIcon size="sm" />
      <div className="flex items-center gap-2">
        {values.map((f) => (
          <div className="flex items-center gap-1 text-xs" key={f.name}>
            {f.name}:{" "}
            <Badge
              className={cn(
                "bg-background-200",
                enabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {f.value}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
