## Element

```json
{
  "id": "Questionnaire.item",
  "path": "Questionnaire.item",
  "constraint": [
    {
      "key": "sdc-1",
      "severity": "error",
      "human": "An item cannot have an answerExpression if answerOption or answerValueSet is already present.",
      "expression": "extension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression').empty().not() implies (answerOption.empty() and answerValueSet.empty())",
      "xpath": "f:extension[@url='http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression'] and (not(f:answerOption) and not(f:answerValueSet))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    },
    {
      "key": "que-1a",
      "severity": "error",
      "human": "Group items must have nested items when Questionanire is complete",
      "expression": "(type='group' and %resource.status='complete') implies item.empty().not()",
      "xpath": "not(f:type/@value='group' and ancestor::f:Questionnaire/f:status/@value='complete') or exists(f:item)",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    },
    {
      "key": "que-1b",
      "severity": "warning",
      "human": "Groups should have items",
      "expression": "type='group' implies item.empty().not()",
      "xpath": "not(f:type='group') or exists(f:item)",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    },
    {
      "key": "que-1c",
      "severity": "error",
      "human": "Display items cannot have child items",
      "expression": "type='display' implies item.empty()",
      "xpath": "not(f:type/@value='display') or not(exists(f:item))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    },
    {
      "key": "que-14",
      "severity": "warning",
      "human": "Can only have answerConstraint if answerOption, answerValueSet, or answerExpression are present. (This is a warning because other extensions may serve the same purpose)",
      "expression": "extension('http://hl7.org/fhir/5.0/StructureDefinition/extension-Questionnaire.item.answerConstraint').exists() implies answerOption.exists() or answerValueSet.exists() or extension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression').exists()",
      "xpath": "not(exists(f:extension[@url='http://hl7.org/fhir/5.0/StructureDefinition/extension-Questionnaire.item.answerConstraint'])) or exists(f:answerOption) or exists(f:answerValueSet) or exists(f:extension[@url='http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression'])",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    }
  ],
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "./form_design/*[self::header or self::footer or self::section]"
    }
  ]
}
```
