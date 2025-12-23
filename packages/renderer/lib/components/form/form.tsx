import { observer } from "mobx-react-lite";
import type {
  IGroupNode,
  IPresentableNode,
  IGroupWrapper,
} from "../../types.ts";
import { IForm } from "../../types.ts";
import { NodesList } from "./node-list.tsx";
import { Node } from "./node.tsx";
import { useEffect, useState, type FormEventHandler } from "react";
import { useTheme } from "../../ui/theme.tsx";
import { isGroupNode } from "../../stores/nodes/groups/group-store.ts";
import { isGroupWrapper } from "../../stores/nodes/groups/group-wrapper.ts";

export const Form = observer(function Form({
  store,
  onSubmit,
}: {
  store: IForm;
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
}) {
  const {
    Button,
    Form: ThemedForm,
    FormHeader,
    FormErrors,
    NodeList,
    FormSection,
    PageStatus,
    PageNavigation,
    EmptyState,
    FormActions,
  } = useTheme();
  const [activePage, setActivePage] = useState(0);

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
    (node): node is IGroupNode | IGroupWrapper =>
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
    <FormSection variant="default">
      <PageStatus
        current={pageCount === 0 ? 0 : clampedPageIndex + 1}
        total={Math.max(pageCount, 1)}
      />
      {currentPage ? (
        <Node node={currentPage} />
      ) : (
        <EmptyState>No pages currently enabled.</EmptyState>
      )}
      <PageNavigation
        current={clampedPageIndex + 1}
        total={Math.max(pageCount, 1)}
        onPrev={() => setActivePage((index) => Math.max(index - 1, 0))}
        onNext={() =>
          setActivePage((index) =>
            pageCount === 0 ? 0 : Math.min(index + 1, pageCount - 1),
          )
        }
        disablePrev={clampedPageIndex === 0 || pageCount === 0}
        disableNext={pageCount === 0 || clampedPageIndex >= pageCount - 1}
      />
    </FormSection>
  ) : null;

  return (
    <ThemedForm onSubmit={onSubmit}>
      {store.questionnaire.title || store.questionnaire.description ? (
        <FormHeader
          title={store.questionnaire.title}
          description={store.questionnaire.description}
        />
      ) : null}
      {issueMessages.length > 0 ? (
        <FormErrors messages={issueMessages} />
      ) : null}
      <NodeList>
        {visibleHeaderNodes.length > 0 ? (
          <FormSection variant="header">
            <NodesList nodes={visibleHeaderNodes} />
          </FormSection>
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
          <EmptyState>No nodes to display.</EmptyState>
        )}
        {visibleFooterNodes.length > 0 ? (
          <FormSection variant="footer">
            <NodesList nodes={visibleFooterNodes} />
          </FormSection>
        ) : null}
      </NodeList>
      <FormActions>
        <Button type="submit">Submit</Button>
        <Button type="button" variant="secondary" onClick={() => store.reset()}>
          Reset
        </Button>
      </FormActions>
    </ThemedForm>
  );
});

function isGroupControlNode(
  node: IPresentableNode,
): node is IGroupNode | IGroupWrapper {
  return isGroupNode(node) || isGroupWrapper(node);
}
