## Element

```json
{
  "id": "QuestionnaireResponse",
  "path": "QuestionnaireResponse",
  "short": "Generic Questionnaire Response",
  "definition": "Sets expectations for supported capabilities for questionnaire responses for SDC-conformant systems.",
  "alias": ["Form Data", "QuestionnaireAnswers"],
  "constraint": [
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bestpractice",
          "valueBoolean": true
        }
      ],
      "key": "sdcqr-1",
      "severity": "warning",
      "human": "Subject SHOULD be present (searching is difficult without subject).  Almost all QuestionnaireResponses should be with respect to some sort of subject.",
      "expression": "subject.exists()",
      "xpath": "exists(f:subject)",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponsecommon"
    },
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bestpractice",
          "valueBoolean": true
        }
      ],
      "key": "sdcqr-2",
      "severity": "error",
      "human": "When repeats=true for a group, it'll be represented with multiple items with the same linkId in the QuestionnaireResponse.  For a question, it'll be represented by a single item with that linkId with multiple answers.",
      "expression": "(QuestionnaireResponse|repeat(answer|item)).select(item.where(answer.value.exists()).linkId.isDistinct()).allTrue()",
      "xpath": "not(exists(for $item in descendant::f:item[f:answer] return $item/preceding-sibling::f:item[f:linkId/@value=$item/f:linkId/@value]))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponsecommon"
    },
    {
      "key": "sdcqr-3",
      "severity": "error",
      "human": "Can either have source or source extension, but not both",
      "expression": "source.count() + extension.where(url='http://hl7.org/fhir/5.0/StructureDefinition/extension-QuestionnaireResponse.source').count() <=1",
      "xpath": "count(f:source | f:extension[@url='http://hl7.org/fhir/5.0/StructureDefinition/extension-QuestionnaireResponse.source']) <= 1",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponsecommon"
    }
  ]
}
```
