import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import {
  MultiSelectControl,
  type CustomKind,
  type MultiSelectMode,
} from "./multi-select-control.tsx";
import { AnswerDisplay } from "../values/answer-display.tsx";

type DropdownMode = MultiSelectMode;

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
} as const;

const dialogStyle = {
  background: "#fff",
  color: "#1a202c",
  padding: "1rem",
  borderRadius: "0.5rem",
  minWidth: "min(90vw, 420px)",
  maxHeight: "90vh",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
} as const;

const controlRowStyle = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
} as const;

const controlStackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
} as const;

export const DropdownControl = observer(function DropdownControl<
  T extends AnswerType,
>({ node, mode }: { node: IQuestionNode<T>; mode: DropdownMode }) {
  const hasChildren =
    Array.isArray(node.template.item) && node.template.item.length > 0;
  const isMultiSelect = node.repeats && !hasChildren;
  const customKind = getCustomKind(node);

  if (isMultiSelect) {
    return (
      <MultiSelectControl
        node={node}
        options={node.options.entries}
        mode={mode}
        customKind={customKind}
      />
    );
  }

  return (
    <AnswerList
      node={node}
      renderRow={(rowProps) =>
        customKind === "none" ? (
          <OptionsRow
            node={node}
            rowProps={rowProps}
            mode={mode}
            isLoading={node.options.loading}
          />
        ) : (
          <OpenChoiceRow
            node={node}
            rowProps={rowProps}
            mode={mode}
            isLoading={node.options.loading}
          />
        )
      }
    />
  );
});

const OptionsRow = observer(function OptionsRow<T extends AnswerType>({
  node,
  rowProps,
  mode,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  mode: DropdownMode;
  isLoading: boolean;
}) {
  const { SelectField, AutocompleteField, Button } = useTheme();
  const { selectValue, legacyOption } = getOptionSelectionState(node, rowProps);
  const canClear = rowProps.value != null && !node.readOnly;

  if (mode === "autocomplete") {
    return (
      <AutocompleteField
        options={node.options.entries}
        selectValue={selectValue}
        legacyOptionLabel={legacyOption?.label}
        onSelect={(key) => {
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        mode="autocomplete"
        isLoading={isLoading}
      />
    );
  }

  if (mode === "lookup") {
    return (
      <LookupSelectField
        node={node}
        rowProps={rowProps}
        selectValue={selectValue}
        legacyOptionLabel={legacyOption?.label}
        onSelect={(key) => {
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
        isLoading={isLoading}
        canClear={canClear}
      />
    );
  }

  return (
    <div style={controlRowStyle}>
      <SelectField
        options={node.options.entries}
        selectValue={selectValue}
        legacyOption={legacyOption}
        onChange={(key) => {
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        isLoading={isLoading}
      />
      {canClear ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() => rowProps.setValue(null)}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
});

const OpenChoiceRow = observer(function OpenChoiceRow<T extends AnswerType>({
  node,
  rowProps,
  mode,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  mode: DropdownMode;
  isLoading: boolean;
}) {
  const { SelectField, AutocompleteField, Button } = useTheme();
  const [forceCustom, setForceCustom] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const customKey = `${node.key}::__specify_other__`;
  const optionKey = node.options.getKeyForValue(rowProps.value);
  const isCustomValue = optionKey === "" && rowProps.value != null;
  const isCustomActive = isCustomValue || forceCustom;
  const canClear = rowProps.value != null && !node.readOnly;

  useEffect(() => {
    if (optionKey && forceCustom) {
      setForceCustom(false);
    }
  }, [forceCustom, optionKey]);

  const extendedOptions = [
    ...node.options.entries,
    {
      key: customKey,
      label: "Specify other",
      value: null as unknown as (typeof node.options.entries)[number]["value"],
    },
  ];

  if (isCustomActive) {
    const renderer = getAnswerInputRenderer(node);
    return (
      <div style={controlStackStyle}>
        {renderer(rowProps)}
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            rowProps.setValue(null);
            setForceCustom(false);
          }}
          disabled={node.readOnly}
        >
          Back to options
        </Button>
      </div>
    );
  }

  const handleSelect = (key: string) => {
    if (key === customKey) {
      setForceCustom(true);
      rowProps.setValue(null);
      return;
    }
    const nextValue = key ? node.options.getValueForKey(key) : null;
    rowProps.setValue(nextValue);
  };

  if (mode === "autocomplete") {
    return (
      <AutocompleteField
        options={extendedOptions}
        selectValue={optionKey}
        legacyOptionLabel={undefined}
        onSelect={(key) => handleSelect(key)}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        mode="autocomplete"
        isLoading={isLoading}
      />
    );
  }

  if (mode === "lookup") {
    return (
      <div style={controlStackStyle}>
        <div style={controlRowStyle}>
          <div>
            <AnswerDisplay
              type={node.type}
              value={rowProps.value}
              placeholder="Select an option"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setLookupOpen(true)}
            disabled={node.readOnly}
          >
            Open lookup
          </Button>
          {canClear ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => rowProps.setValue(null)}
            >
              Clear
            </Button>
          ) : null}
        </div>
        {lookupOpen ? (
          <div style={overlayStyle} role="dialog" aria-modal="true">
            <div style={dialogStyle}>
              <div style={{ fontWeight: 600 }}>Lookup options</div>
              <AutocompleteField
                options={extendedOptions}
                selectValue={optionKey}
                legacyOptionLabel={undefined}
                onSelect={(key) => {
                  handleSelect(key);
                  setLookupOpen(false);
                }}
                inputId={rowProps.inputId}
                labelId={rowProps.labelId}
                describedById={rowProps.describedById}
                readOnly={node.readOnly}
                mode="lookup"
                isLoading={isLoading}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setLookupOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div style={controlRowStyle}>
      <SelectField
        options={extendedOptions}
        selectValue={optionKey}
        legacyOption={null}
        onChange={(key) => handleSelect(key)}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        isLoading={isLoading}
      />
      {canClear ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() => rowProps.setValue(null)}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
});

const LookupSelectField = observer(function LookupSelectField<
  T extends AnswerType,
>({
  node,
  rowProps,
  selectValue,
  legacyOptionLabel,
  onSelect,
  isLoading,
  canClear,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  selectValue: string;
  legacyOptionLabel: string | undefined;
  onSelect: (key: string) => void;
  isLoading: boolean;
  canClear: boolean;
}) {
  const { AutocompleteField, Button } = useTheme();
  const [lookupOpen, setLookupOpen] = useState(false);

  return (
    <div style={controlStackStyle}>
      <div style={controlRowStyle}>
        <div>
          <AnswerDisplay
            type={node.type}
            value={rowProps.value}
            placeholder="Select an option"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setLookupOpen(true)}
          disabled={node.readOnly}
        >
          Open lookup
        </Button>
        {canClear ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => rowProps.setValue(null)}
          >
            Clear
          </Button>
        ) : null}
      </div>
      {lookupOpen ? (
        <div style={overlayStyle} role="dialog" aria-modal="true">
          <div style={dialogStyle}>
            <div style={{ fontWeight: 600 }}>Lookup options</div>
            <AutocompleteField
              options={node.options.entries}
              selectValue={selectValue}
              legacyOptionLabel={legacyOptionLabel}
              onSelect={(key) => {
                onSelect(key);
                setLookupOpen(false);
              }}
              inputId={rowProps.inputId}
              labelId={rowProps.labelId}
              describedById={rowProps.describedById}
              readOnly={node.readOnly}
              mode="lookup"
              isLoading={isLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLookupOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
});

function getCustomKind(node: IQuestionNode): CustomKind {
  if (node.options.constraint === "optionsOrString") return "string";
  if (node.options.constraint === "optionsOrType") return "type";
  return "none";
}

function getOptionSelectionState(
  node: IQuestionNode,
  rowProps: RowRenderProps,
) {
  const regularKey = node.options.getKeyForValue(rowProps.value);
  const legacyOption =
    regularKey || rowProps.value == null
      ? null
      : node.options.getLegacyEntryForValue(
          rowProps.answer.key,
          rowProps.value,
        );
  const selectValue = regularKey || legacyOption?.key || "";

  return { selectValue, legacyOption };
}
