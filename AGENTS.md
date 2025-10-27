### Core concepts
* rendered (realized) questionnaire response is form managed by `FormStore`, which keeps a registry of top-level nodes
* rendered questionnaire response item is node (one of the node stores implementing `INodeStore`)
* questionnaire item is template for node (`QuestionnaireItem` backing each store)
* nodes can have child nodes (`children` or `instances` on the store)
* node can be either a display, a group, or a question (`DisplayStore`, `NonRepeatingGroupStore`/`RepeatingGroupStore`, `QuestionStore`)
* display node cannot have child nodes
* question node is answerable node
* display node and group node are not answerable nodes
* group node can be repeated
* repeatable group node can have multiple instances stored in its `instances` collection
* question node can be repeated when `repeats` is true
* repeatable question node can have multiple answers in its `answers` collection
* display node is rendered as text block
* non-repeated group node is rendered as a block with header and list of child nodes
* repeated group node is rendered as list of instances and an add button
* instance of repeated group node is rendered as a block with header, remove button, and list of child nodes (`RepeatingGroupInstance`), which also maintains its own `linkId` registry
* non-repeatable question node is rendered as a block with label and input control when `repeats` is false
* repeated question node is rendered as a block with label, list of answers with remove button, and add button
* answers are rendered as blocks with input control and optional child nodes, represented by `AnswerInstance`, which keeps a scoped registry for nested items
* input control type depends on question node's template type
* string/text question node is rendered as text input control
* integer question node is rendered as number input control
* decimal question node is rendered as decimal input control
* boolean question node is rendered as checkbox input control
* date question node is rendered as date picker input control
* dateTime question node is rendered as date-time picker input control
* time question node is rendered as time picker input control
* quantity question node is rendered as composite input control for value and unit
* coding question node is rendered as dropdown/select input control
* reference question node is rendered as autocomplete input control
* url question node is rendered as URL input control
* attachment question node is rendered as file upload input control
* repeatable question nodes may render single control for multiple answers
* `AbstractNodeStore` forwards registration and lookup through parent scopes so nested nodes can access ancestors
* question answers seed from questionnaire response items so repeated answers load existing values
* repeating group instances seed from matching response items
* repeating groups enforce min/max occurs limits on their instances
* question nodes enforce min/max occurs limits on their answers

### Coding guidelines
* do not call `makeObservable` with explicit annotations or `makeAutoObservable` in stores
* rely on MobX decorators instead and call `makeObservable(this)` in constructor
