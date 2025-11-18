import type {
  GroupControlDefinition,
  IGroupNode,
  IRepeatingGroupWrapper,
} from "../../types.ts";
import { DefaultControl } from "../../components/nodes/group/group/controls/default-control.tsx";
import { FooterControl } from "../../components/nodes/group/group/controls/footer-control.tsx";
import { GridControl } from "../../components/nodes/group/group/controls/grid-control.tsx";
import { HeaderControl } from "../../components/nodes/group/group/controls/header-control.tsx";
import { HTableControl } from "../../components/nodes/group/group/controls/htable-control.tsx";
import { PageControl } from "../../components/nodes/group/group/controls/page-control.tsx";
import { TabContainerControl } from "../../components/nodes/group/group/controls/tab-container-control.tsx";
import { TableControl } from "../../components/nodes/group/group/controls/table-control.tsx";
import { GTableControl } from "../../components/nodes/group/repeating-group-wrapper/controls/gtable-control.tsx";
import { RepeatingGroupScaffold } from "../../components/nodes/group/repeating-group-wrapper/repeating-group-scaffold.tsx";

export class GroupControlRegistry {
  private readonly definitions: GroupControlDefinition[];

  constructor(initialDefinitions: GroupControlDefinition[]) {
    this.definitions = [...initialDefinitions].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  resolveNonRepeating(node: IGroupNode): GroupControlDefinition | undefined {
    return this.definitions.find(
      (definition) =>
        definition.groupComponent !== undefined && definition.matcher(node),
    );
  }

  resolveRepeating(
    wrapper: IRepeatingGroupWrapper,
  ): GroupControlDefinition | undefined {
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
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-page",
    priority: 10,
    matcher: (node) => node.control === "page",
    groupComponent: PageControl,
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-header",
    priority: 10,
    matcher: (node) => node.control === "header",
    groupComponent: HeaderControl,
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-footer",
    priority: 10,
    matcher: (node) => node.control === "footer",
    groupComponent: FooterControl,
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-grid",
    priority: 10,
    matcher: (node) => node.control === "grid",
    groupComponent: GridControl,
    wrapperComponent: RepeatingGroupScaffold,
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
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-table",
    priority: 10,
    matcher: (node) => node.control === "table",
    groupComponent: TableControl,
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-list",
    priority: 10,
    matcher: (node) => node.control === "list",
    groupComponent: DefaultControl,
    wrapperComponent: RepeatingGroupScaffold,
  },
  {
    name: "group-default",
    priority: Number.NEGATIVE_INFINITY,
    matcher: () => true,
    groupComponent: DefaultControl,
    wrapperComponent: RepeatingGroupScaffold,
  },
];
