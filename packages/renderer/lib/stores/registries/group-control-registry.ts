import type {
  GroupControlDefinition,
  IGroupNode,
  IGroupWrapper,
} from "../../types.ts";
import { DefaultRenderer } from "../../components/nodes/group/renderers/default-renderer.tsx";
import { FooterRenderer } from "../../components/nodes/group/renderers/footer-renderer.tsx";
import { GridRenderer } from "../../components/nodes/group/renderers/grid-renderer.tsx";
import { HeaderRenderer } from "../../components/nodes/group/renderers/header-renderer.tsx";
import { HorizontalTableRenderer } from "../../components/nodes/group/renderers/horizontal-table-renderer.tsx";
import { PageRenderer } from "../../components/nodes/group/renderers/page-renderer.tsx";
import { TabContainerRenderer } from "../../components/nodes/group/renderers/tab-container-renderer.tsx";
import { VerticalTableRenderer } from "../../components/nodes/group/renderers/vertical-table-renderer.tsx";
import { GTableRenderer } from "../../components/nodes/group/renderers/gtable-renderer.tsx";
import { GroupWrapperScaffold } from "../../components/nodes/group/group-wrapper-scaffold.tsx";

export class GroupControlRegistry {
  private readonly definitions: GroupControlDefinition[];

  constructor(initialDefinitions: GroupControlDefinition[]) {
    this.definitions = [...initialDefinitions].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  resolveGroup(node: IGroupNode): GroupControlDefinition | undefined {
    return this.definitions.find(
      (definition) =>
        definition.groupComponent !== undefined && definition.matcher(node),
    );
  }

  resolveWrapper(wrapper: IGroupWrapper): GroupControlDefinition | undefined {
    return this.definitions.find(
      (definition) =>
        definition.wrapperComponent !== undefined &&
        definition.matcher(wrapper),
    );
  }
}

export const defaultGroupControlDefinitions: GroupControlDefinition[] = [
  {
    name: "group-tab-container",
    priority: 100,
    matcher: (node) => node.control === "tab-container",
    groupComponent: TabContainerRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-page",
    priority: 10,
    matcher: (node) => node.control === "page",
    groupComponent: PageRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-header",
    priority: 10,
    matcher: (node) => node.control === "header",
    groupComponent: HeaderRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-footer",
    priority: 10,
    matcher: (node) => node.control === "footer",
    groupComponent: FooterRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-grid",
    priority: 10,
    matcher: (node) => node.control === "grid",
    groupComponent: GridRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-gtable",
    priority: 10,
    matcher: (node) => node.control === "gtable",
    wrapperComponent: GTableRenderer,
  },
  {
    name: "group-htable",
    priority: 10,
    matcher: (node) => node.control === "htable",
    groupComponent: HorizontalTableRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-table",
    priority: 10,
    matcher: (node) => node.control === "table",
    groupComponent: VerticalTableRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-list",
    priority: 10,
    matcher: (node) => node.control === "list",
    groupComponent: DefaultRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-default",
    priority: Number.NEGATIVE_INFINITY,
    matcher: () => true,
    groupComponent: DefaultRenderer,
    wrapperComponent: GroupWrapperScaffold,
  },
];
