## Element

```json
{
  "id": "Questionnaire.item.enableWhen",
  "path": "Questionnaire.item.enableWhen",
  "short": "Only allow data when",
  "definition": "A constraint indicating that this item should only be enabled (displayed/allow answers to be captured) when the specified condition is true.",
  "comment": "If multiple repetitions of this extension are present, the interpretation is driven by enableBehavior (either all repetitions must evaluate to true for this item to be enabled, or only one must evaluate to true for the item to be enabled).  If the enableWhen.question has multiple answers, the condition evaluates to true if *any* of the answers for the referenced item match the enableWhen condition.  This element is a modifier because if enableWhen is present for an item, \"required\" is ignored unless one of the enableWhen conditions is met. When an item is disabled, all of its descendants are disabled, regardless of what their own enableWhen logic might evaluate to.  If enableWhen logic depends on an item that is disabled, the logic should proceed as though the item is not valued - even if a default value or other value might be retained in memory in the event of the item being re-enabled.  In some cases, the comparison between the indicated answer and the specified value may differ only by precision.  For example, the enableWhen might be Q1 > 1970, but the answer to Q1 is 1970-10-15.  There is not a clear answer as to whether 1970-10-15 should be considered 'greater' than 1970, given that it is an imprecise value.  In these indeterminate situations, the form filler has the option of refusing to render the form.  If the form **is** displayed, items where enableWhen is indeterminate SHOULD be treated as enabled with a warning indicating that the questionnaire logic was faulty and it is possible that the item should not be enabled.  Questionnaires SHOULD be designed to take into account challenges around varying precision to minimize non-deterministic situations by setting constraints around expected precision, etc.",
  "requirements": "Allows questionnaires to adapt based on answers to other questions. E.g. If physical gender is specified as a male, no need to capture pregnancy history.  Also allows conditional display of instructions or groups of questions.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "BackboneElement"
    }
  ],
  "condition": ["que-12"],
  "constraint": [
    {
      "key": "que-7",
      "severity": "error",
      "human": "If the operator is 'exists', the value must be a boolean",
      "expression": "operator = 'exists' implies (answer is boolean)",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    }
  ],
  "mustSupport": false,
  "isModifier": true,
  "isModifierReason": "If enableWhen is present and the condition evaluates to false, then the Questionnaire behaves as though the elements weren't actually present",
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
