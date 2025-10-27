import "./form.css";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import { IFormStore } from "../stores/types.ts";
import { ItemsList } from "./common/item-list.tsx";
import { FormEvent, useEffect } from "react";
import type { QuestionnaireResponse } from "fhir/r5";

export const Form = observer(function FormRoot({
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
      <div className="af-items">
        {store.nodes.length > 0 ? (
          <ItemsList items={store.nodes} />
        ) : (
          <p className="af-empty">No items to display.</p>
        )}
      </div>
      <div className="af-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={store.reset}>
          Reset
        </button>
      </div>
    </form>
  );
});
