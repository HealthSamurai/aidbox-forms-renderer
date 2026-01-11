### Core concepts

- rendered (realized) questionnaire response is form managed by `FormStore`, which keeps a registry of top-level nodes
- rendered questionnaire response item is node (one of the node stores implementing `INodeStore`)
- questionnaire item is template for node (`QuestionnaireItem` backing each store)
- nodes can have child nodes (`children` or `instances` on the store)
- node can be either a display, a group, or a question (`DisplayStore`, `GroupStore`/`GroupListStore`, `QuestionStore`)
- display node cannot have child nodes
- question node is answerable node
- display node and group node are not answerable nodes
- group node can be repeated
- question node can be repeated when `repeats` is true
- display node is rendered as text block
- non-repeated group node is rendered as a block with header and list of child nodes
- repeated group node (`GroupListStore`) is rendered as list of instances exposed through its `nodes` collection plus an add button
- each repeating group instance (`GroupStore`) renders a block with header, remove button, and its child nodes while extending the scope registry for nested `linkId`s
- repeated question node is rendered as a block with label, list of answers with remove button, and add button
- non-repeating question node keeps exactly one `AnswerStore`, hides add/remove controls, and still renders a label with a single input control
- answers are rendered as blocks with input control and optional child nodes, represented by `AnswerStore`, which keeps a scoped registry for nested items
- input control type depends on question node's template type
- string/text question node is rendered as text input control
- integer question node is rendered as number input control
- decimal question node is rendered as decimal input control
- boolean question node is rendered as checkbox input control
- date question node is rendered as date picker input control
- dateTime question node is rendered as date-time picker input control
- time question node is rendered as time picker input control
- quantity question node is rendered as composite input control for value and unit
- coding question node is rendered as dropdown/select input control
- reference question node is rendered as reference input control
- url question node is rendered as URL input control
- attachment question node is rendered as file upload input control
- repeatable question nodes may render single control for multiple answers
- `AbstractActualNodeStore` forwards registration and lookup through parent scopes so nested nodes can access ancestors
- question answers seed from questionnaire response items so repeated answers load existing values
- repeating group instances seed from matching response items
- repeating groups enforce min/max occurs limits on their instances
- question nodes enforce min/max occurs limits on their answers
- readonly and hidden both consider the items enablement under the hood so isEnabled must not be used in ui components

### Component roles

- renderer: top-level question component, owns question scaffold and decides which control to render
- control: component passed into answer list as the render callback; receives value control props and renders the input for a single answer
- input: store-agnostic UI widget that renders the actual form element
- control: maps domain/store state into mechanical input props (value, bounds, handlers)
- answer list: renders one or more answers for a question and wraps each in answer scaffold
- answer scaffold: per-answer layout (input + toolbar + child nodes + errors)
- question scaffold: per-question layout (label/help/options state)
- value inputs: input widgets used by controls
- value displays: read-only views used for chips/options

### Coding guidelines

- do not call `makeObservable` with explicit annotations or `makeAutoObservable` in stores
- rely on MobX decorators instead and call `makeObservable(this)` in constructor
- prefer undefined over null to encode absence of value
- when writing tests use describe/it functions extensively to group related checks and assertions with meaningful text
- prefer small isolated tests with dedicated test data
- prefer having functions over class methods if `this` is not used
- exactOptionalPropertyTypes is enabled so when defining types prefer union with undefined over optional properties
- avoid local const aliases that only shorten getters/properties; inline `this.foo` unless it is reused for a meaningful purpose
- don't use margins, instead use flexbox/gap to space elements
