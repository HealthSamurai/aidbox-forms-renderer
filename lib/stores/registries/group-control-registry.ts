import type {
  GroupControlDefinition,
  IGroupNode,
  IGroupWrapper,
} from "../../types.ts";
import { DefaultControl } from "../../components/nodes/group/controls/default-control.tsx";
import { FooterControl } from "../../components/nodes/group/controls/footer-control.tsx";
import { GridControl } from "../../components/nodes/group/controls/grid-control.tsx";
import { HeaderControl } from "../../components/nodes/group/controls/header-control.tsx";
import { HTableControl } from "../../components/nodes/group/controls/htable-control.tsx";
import { PageControl } from "../../components/nodes/group/controls/page-control.tsx";
import { TabContainerControl } from "../../components/nodes/group/controls/tab-container-control.tsx";
import { TableControl } from "../../components/nodes/group/controls/table-control.tsx";
import { GTableControl } from "../../components/nodes/group/controls/gtable-control.tsx";
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
    groupComponent: TabContainerControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-page",
    priority: 10,
    matcher: (node) => node.control === "page",
    groupComponent: PageControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-header",
    priority: 10,
    matcher: (node) => node.control === "header",
    groupComponent: HeaderControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-footer",
    priority: 10,
    matcher: (node) => node.control === "footer",
    groupComponent: FooterControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-grid",
    priority: 10,
    matcher: (node) => node.control === "grid",
    groupComponent: GridControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-gtable",
    priority: 10,
    matcher: (node) => node.control === "gtable",
    wrapperComponent: GTableControl,
  },
  {
    name: "group-htable",
    priority: 10,
    matcher: (node) => node.control === "htable",
    groupComponent: HTableControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-table",
    priority: 10,
    matcher: (node) => node.control === "table",
    groupComponent: TableControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-list",
    priority: 10,
    matcher: (node) => node.control === "list",
    groupComponent: DefaultControl,
    wrapperComponent: GroupWrapperScaffold,
  },
  {
    name: "group-default",
    priority: Number.NEGATIVE_INFINITY,
    matcher: () => true,
    groupComponent: DefaultControl,
    wrapperComponent: GroupWrapperScaffold,
  },
];
