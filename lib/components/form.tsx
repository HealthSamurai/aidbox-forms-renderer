import "./form.css";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import { IFormStore } from "../stores/types.ts";
import { ItemsList } from "./common/item-list.tsx";
import { FormEvent, useEffect } from "react";
import { Button } from "./controls/button.tsx";
import type { QuestionnaireResponse } from "fhir/r5";

export const Form = observer(function Form({
  store,
  onSubmit,
  onChange,
}: {
  store: IFormStore;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
}) {
  useEffect(() => {
    if (!onChange) {
      return;
    }

    const dispose = autorun(() => {
      if (!store.response) {
        return;
      }

      onChange(store.response);
    });

    return () => {
      dispose();
    };
  }, [onChange, store]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = store.validateAll();
    if (!isValid) {
      return;
    }

    if (store.response && onSubmit) {
      onSubmit(store.response);
    }
  };

  const issueMessages = store.issues
    .map((issue) => issue.diagnostics?.trim() || issue.details?.text?.trim())
    .filter((message): message is string => Boolean(message));

  return (
    <form className="af-form" onSubmit={handleSubmit}>
      {store.questionnaire.title || store.questionnaire.description ? (
        <header>
          {store.questionnaire.title ? (
            <h1 className="af-title">{store.questionnaire.title}</h1>
          ) : null}
          {store.questionnaire.description ? (
            <p className="af-description">{store.questionnaire.description}</p>
          ) : null}
        </header>
      ) : null}
      {issueMessages.length > 0 ? (
        <ul className="af-form-errors" role="alert">
          {issueMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : null}
      <div className="af-items">
        {store.children.length > 0 ? (
          <ItemsList items={store.children} />
        ) : (
          <p className="af-empty">No items to display.</p>
        )}
      </div>
      <div className="af-actions">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="secondary" onClick={() => store.reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
});
