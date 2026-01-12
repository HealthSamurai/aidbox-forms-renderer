import type { InputGroupProperties } from "@aidbox-forms/theme";
import { Col, Row } from "antd";
import { Children } from "react";

export function InputGroup({
  children,
  layout,
  weights,
}: InputGroupProperties) {
  const items = Children.toArray(children);
  const gutter: [number, number] = layout === "grid" ? [16, 16] : [12, 0];

  return (
    <Row gutter={gutter} wrap>
      {items.map((child, index) => (
        <Col key={index} flex={weights?.[index] ?? 1}>
          {child}
        </Col>
      ))}
    </Row>
  );
}
