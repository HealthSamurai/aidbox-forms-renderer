type FunctionComponent = (...arguments_: readonly never[]) => unknown;

export function observer<TComponent extends FunctionComponent>(
  component: TComponent,
): TComponent {
  return component;
}
