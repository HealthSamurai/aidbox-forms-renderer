import { FormEvent } from "react";

import { useStateContext } from "../state/state-context.ts";
import type { QuestionnaireResponse } from "fhir/r5";
import { Item } from "./items";

function QuestionnaireRenderer({
  onSubmit,
}: {
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
}) {
  const { questionnaire, response, reset } = useStateContext();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(response);
  };

  const items = questionnaire.item ?? [];

  return (
    <form className="q-form" onSubmit={handleSubmit}>
      {questionnaire.title || questionnaire.description ? (
        <header>
          {questionnaire.title ? (
            <h1 className="q-title">{questionnaire.title}</h1>
          ) : null}
          {questionnaire.description ? (
            <p className="q-description">{questionnaire.description}</p>
          ) : null}
        </header>
      ) : null}
      <div className="q-items">
        {items.length > 0 ? (
          items.map((item) => <Item key={item.linkId} item={item} />)
        ) : (
          <p className="q-empty">No items to display.</p>
        )}
      </div>
      <div className="q-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default QuestionnaireRenderer;
