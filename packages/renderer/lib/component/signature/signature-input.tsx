import { useCallback, useMemo } from "react";
import type { Signature } from "@formbox/fhir";
import type { NodePath } from "@formbox/theme";
import {
  prepareDataUrlFromSignature,
  prepareSignatureFromDataUrl,
} from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";

export type SignatureInputProperties = {
  value: Signature | undefined;
  onChange: (value: Signature | undefined) => void;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

export function SignatureInput({
  value,
  onChange,
  id,
  path,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: SignatureInputProperties) {
  const { SignatureInput: ThemedSignatureInput } = useTheme();
  const dataUrl = useMemo(() => prepareDataUrlFromSignature(value), [value]);

  const handleChange = useCallback(
    (next?: string) => {
      onChange(next ? prepareSignatureFromDataUrl(next) : undefined);
    },
    [onChange],
  );

  return (
    <ThemedSignatureInput
      id={id}
      path={path}
      value={dataUrl}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={disabled}
      onChange={handleChange}
    />
  );
}
