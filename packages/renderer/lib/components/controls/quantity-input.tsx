import "./quantity-input.css";
import "./text-input.css";
import { IAnswerInstance, IQuestionNode } from "../../types.ts";

export function QuantityInput({
  answer,
  node,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
  inputId,
  list,
  placeholder,
}: {
  answer: IAnswerInstance<"quantity">;
  node: IQuestionNode<"quantity">;
  disabled?: boolean | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  inputId: string;
  list?: string | undefined;
  placeholder?: string | undefined;
}) {
  const describedBy = ariaDescribedBy ?? undefined;

  return (
    <div className="af-quantity-input">
      <div className="af-quantity-input__value">
        <input
          id={inputId}
          list={list}
          className="af-input"
          type="number"
          value={answer.value?.value ?? ""}
          step="any"
          onChange={(event) =>
            answer.quantity.handleNumberInput(event.target.value)
          }
          disabled={disabled || node.readOnly}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          placeholder={placeholder}
        />
      </div>
      <div className="af-quantity-input__unit">
        {!answer.quantity.isUnitFreeForm ? (
          <select
            className="af-input"
            value={answer.quantity.displayUnitKey}
            onChange={(event) =>
              answer.quantity.handleSelectChange(event.target.value)
            }
            disabled={disabled || node.readOnly}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
          >
            <option value="">Select a unit</option>
            {answer.quantity.entries.map((option) => (
              <option
                key={option.key}
                value={option.key}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="af-input"
            type="text"
            value={answer.value?.unit ?? ""}
            onChange={(event) =>
              answer.quantity.handleFreeTextChange(event.target.value)
            }
            placeholder="unit"
            disabled={disabled || node.readOnly}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
          />
        )}
      </div>
    </div>
  );
}
