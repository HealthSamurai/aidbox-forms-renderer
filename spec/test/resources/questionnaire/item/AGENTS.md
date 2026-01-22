## Element

```json
{
  "id": "Questionnaire.item",
  "path": "Questionnaire.item",
  "short": "Questions and sections within the Questionnaire",
  "definition": "A particular question, question grouping or display text that is part of the questionnaire.",
  "comment": "The content of the questionnaire is constructed from an ordered, hierarchical collection of items.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "BackboneElement"
    }
  ],
  "constraint": [
    {
      "key": "que-9",
      "severity": "error",
      "human": "Read-only can't be specified for \"display\" items",
      "expression": "type!='display' or readOnly.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-8",
      "severity": "error",
      "human": "Initial values can't be specified for groups or display items",
      "expression": "(type!='group' and type!='display') or initial.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-6",
      "severity": "error",
      "human": "Required and repeat aren't permitted for display items",
      "expression": "type!='display' or (required.empty() and repeats.empty())",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-5",
      "severity": "error",
      "human": "Only coding, decimal, integer, date, dateTime, time, string or quantity  items can have answerOption or answerValueSet",
      "expression": "(type='coding' or type = 'decimal' or type = 'integer' or type = 'date' or type = 'dateTime' or type = 'time' or type = 'string' or type = 'quantity') or (answerValueSet.empty() and answerOption.empty())",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-4",
      "severity": "error",
      "human": "A question cannot have both answerOption and answerValueSet",
      "expression": "answerOption.empty() or answerValueSet.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-3",
      "severity": "error",
      "human": "Display items cannot have a \"code\" asserted",
      "expression": "type!='display' or code.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-1c",
      "severity": "error",
      "human": "Display items cannot have child items",
      "expression": "type='display' implies item.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-1a",
      "severity": "error",
      "human": "Group items must have nested items when Questionanire is complete",
      "expression": "(type='group' and %resource.status='complete') implies item.empty().not()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-1b",
      "severity": "warning",
      "human": "Groups should have items",
      "expression": "type='group' implies item.empty().not()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-10",
      "severity": "error",
      "human": "Maximum length can only be declared for simple question types",
      "expression": "(type in ('boolean' | 'decimal' | 'integer' | 'string' | 'text' | 'url')) or answerConstraint='optionOrString' or maxLength.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-13",
      "severity": "error",
      "human": "Can only have multiple initial values for repeating items",
      "expression": "repeats=true or initial.count() <= 1",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-14",
      "severity": "warning",
      "human": "Can only have answerConstraint if answerOption or answerValueSet are present.  (This is a warning because extensions may serve the same purpose)",
      "expression": "answerConstraint.exists() implies answerOption.exists() or answerValueSet.exists()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-11",
      "severity": "error",
      "human": "If one or more answerOption is present, initial cannot be present.  Use answerOption.initialSelected instead",
      "expression": "answerOption.empty() or initial.empty()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-12",
      "severity": "error",
      "human": "If there are more than one enableWhen, enableBehavior must be specified",
      "expression": "enableWhen.count() > 1 implies enableBehavior.exists()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=COMP].target[classCode=OBS, moodCode=DEF]"
    }
  ]
}
```
