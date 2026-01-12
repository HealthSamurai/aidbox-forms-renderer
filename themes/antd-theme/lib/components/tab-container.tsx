import type { TabContainerProperties } from "@aidbox-forms/theme";
import { Space, Tabs } from "antd";

export function TabContainer({
  header,
  items,
  value,
  onChange,
  errors,
  linkId,
}: TabContainerProperties) {
  const activeKey = items[value]?.token ?? items[0]?.token;

  return (
    <div data-linkid={linkId}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {header}
        {errors}
        <Tabs
          activeKey={activeKey}
          onChange={(key) => {
            const nextIndex = items.findIndex((item) => item.token === key);
            if (nextIndex !== -1) {
              onChange(nextIndex);
            }
          }}
          items={items.map((item) => ({
            key: item.token,
            label: item.label,
            children: item.content,
          }))}
        />
      </Space>
    </div>
  );
}
