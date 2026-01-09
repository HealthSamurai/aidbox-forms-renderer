import { observer } from "mobx-react-lite";
import type { IForm } from "../../types.ts";
import { NodeList } from "./node-list.tsx";
import { FormErrors } from "./form-errors.tsx";
import { useTheme } from "../../ui/theme.tsx";

export const Form = observer(function Form({
  store,
  onSubmit,
}: {
  store: IForm;
  onSubmit?: (() => void) | undefined;
}) {
  const { Form: ThemedForm } = useTheme();

  return (
    <ThemedForm
      title={store.questionnaire.title}
      description={store.questionnaire.description}
      errors={<FormErrors issues={store.issues} />}
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
