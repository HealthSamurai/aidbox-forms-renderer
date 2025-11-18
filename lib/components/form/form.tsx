import "./form.css";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import type {
  IGroupNode,
  IPresentableNode,
  IRepeatingGroupWrapper,
} from "../../types.ts";
import { IForm } from "../../types.ts";
import { NodesList } from "./node-list.tsx";
import { Node } from "./node.tsx";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../controls/button.tsx";
import type { QuestionnaireResponse } from "fhir/r5";
import { isGroupNode } from "../../stores/nodes/groups/group-store.ts";
import { isRepeatingGroupWrapper } from "../../stores/nodes/groups/repeating-group-wrapper.ts";

export const Form = observer(function Form({
  store,
  onSubmit,
  onChange,
}: {
  store: IForm;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
}) {
  const [activePage, setActivePage] = useState(0);

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

  const headerNodes = store.nodes.filter(
    (node): node is IGroupNode =>
      isGroupNode(node) && node.control === "header",
  );
  const footerNodes = store.nodes.filter(
    (node): node is IGroupNode =>
      isGroupNode(node) && node.control === "footer",
  );
  const headerSet = new Set<IPresentableNode>(headerNodes);
  const footerSet = new Set<IPresentableNode>(footerNodes);
  const nonHeaderFooterNodes = store.nodes.filter(
    (node) => !headerSet.has(node) && !footerSet.has(node),
  );
  const pageNodes = nonHeaderFooterNodes.filter(
    (node): node is IGroupNode | IRepeatingGroupWrapper =>
      isGroupControlNode(node) && node.control === "page",
  );
  const pageSet = new Set<IPresentableNode>(pageNodes);
  const staticNodes = nonHeaderFooterNodes.filter((node) => !pageSet.has(node));
  const visibleHeaderNodes = headerNodes.filter((node) => !node.hidden);
  const visibleFooterNodes = footerNodes.filter((node) => !node.hidden);
  const visiblePages = pageNodes.filter((node) => !node.hidden);
  const visibleStaticNodes = staticNodes.filter((node) => !node.hidden);
  const showPaged = pageNodes.length > 0;
  const pageCount = visiblePages.length;
  const clampedPageIndex =
    pageCount === 0 ? 0 : Math.min(activePage, pageCount - 1);
  const currentPage = visiblePages[clampedPageIndex];

  useEffect(() => {
    if (activePage >= pageCount && pageCount > 0) {
      setActivePage(pageCount - 1);
    }
    if (pageCount === 0 && activePage !== 0) {
      setActivePage(0);
    }
  }, [activePage, pageCount]);

  const renderPageSection = showPaged ? (
    <section className="af-page-section">
      <div className="af-page-status" aria-live="polite">
        Page {pageCount === 0 ? 0 : clampedPageIndex + 1} of{" "}
        {Math.max(pageCount, 1)}
      </div>
      {currentPage ? (
        <Node node={currentPage} />
      ) : (
        <p className="af-empty">No pages currently enabled.</p>
      )}
      <div className="af-page-navigation">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setActivePage((index) => Math.max(index - 1, 0))}
          disabled={clampedPageIndex === 0 || pageCount === 0}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setActivePage((index) =>
              pageCount === 0 ? 0 : Math.min(index + 1, pageCount - 1),
            )
          }
          disabled={pageCount === 0 || clampedPageIndex >= pageCount - 1}
        >
          Next
        </Button>
      </div>
    </section>
  ) : null;

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
      <div className="af-nodes">
        {visibleHeaderNodes.length > 0 ? (
          <section className="af-form-header-block">
            <NodesList nodes={visibleHeaderNodes} />
          </section>
        ) : null}
        {showPaged ? (
          <>
            {renderPageSection}
            {visibleStaticNodes.length > 0 ? (
              <NodesList nodes={visibleStaticNodes} />
            ) : null}
          </>
        ) : store.nodes.length > 0 ? (
          <NodesList nodes={nonHeaderFooterNodes} />
        ) : (
          <p className="af-empty">No nodes to display.</p>
        )}
        {visibleFooterNodes.length > 0 ? (
          <section className="af-form-footer-block">
            <NodesList nodes={visibleFooterNodes} />
          </section>
        ) : null}
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

function isGroupControlNode(
  node: IPresentableNode,
): node is IGroupNode | IRepeatingGroupWrapper {
  return isGroupNode(node) || isRepeatingGroupWrapper(node);
}
