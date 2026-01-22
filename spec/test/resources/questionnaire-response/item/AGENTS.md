## Element

```json
{
  "id": "QuestionnaireResponse.item",
  "path": "QuestionnaireResponse.item",
  "short": "Groups and questions",
  "definition": "A group or question item from the original questionnaire for which answers are provided.",
  "comment": "Groups cannot have answers and therefore must nest directly within item. When dealing with questions, nesting must occur within each answer because some questions may have multiple answers (and the nesting occurs for each answer).\\nWhen dealing with repeating items, each group repetition will be handled by a separate item.  However, repeating questions are handled with a single question item and potentially multiple answers.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "BackboneElement"
    }
  ],
  "constraint": [
    {
      "key": "qrs-2",
      "severity": "error",
      "human": "Repeated answers are combined in the answers array of a single item",
      "expression": "repeat(answer|item).select(item.where(answer.value.exists()).linkId.isDistinct()).allTrue()",
      "source": "http://hl7.org/fhir/StructureDefinition/QuestionnaireResponse"
    },
    {
      "key": "qrs-1",
      "severity": "error",
      "human": "Item cannot contain both item and answer",
      "expression": "(answer.exists() and item.exists()).not()",
      "source": "http://hl7.org/fhir/StructureDefinition/QuestionnaireResponse"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=COMP].target[classCode=OBS, moodCode=EVN]"
    }
  ]
}
```
