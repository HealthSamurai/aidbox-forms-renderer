import { observer } from "mobx-react-lite";
import type { IForm } from "../../types.ts";
import { NodeList } from "../node/node-list.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { FormErrors } from "./form-errors.tsx";

export const Form = observer(function Form({
  store,
  onSubmit,
}: {
  store: IForm;
  onSubmit?: (() => void) | undefined;
}) {
  const { Form: ThemedForm } = useTheme();
  const errors =
    store.issues.length > 0 ? <FormErrors issues={store.issues} /> : undefined;

  return (
    <ThemedForm
      title={store.questionnaire.title}
      description={store.questionnaire.description}
      errors={errors}
      before={<NodeList nodes={store.headerNodes} />}
      after={<NodeList nodes={store.footerNodes} />}
      onSubmit={onSubmit}
      onCancel={() => store.reset()}
      pagination={store.pagination}
    >
      <NodeList nodes={store.contentNodes} />
    </ThemedForm>
  );
});
