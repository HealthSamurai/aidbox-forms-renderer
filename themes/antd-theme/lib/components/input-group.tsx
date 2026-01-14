import type { InputGroupProperties } from "@aidbox-forms/theme";
import { Col, Row, theme } from "antd";
import { Children } from "react";

export function InputGroup({ children, spans }: InputGroupProperties) {
  const items = Children.toArray(children);
  const { token } = theme.useToken();
  const gutter: [number, number] = [token.marginSM, token.marginSM];

  return (
    <Row gutter={gutter} wrap>
      {items.map((child, index) => (
        <Col key={index} span={spans[index] * 2} xs={24}>
          {child}
        </Col>
      ))}
    </Row>
  );
}
