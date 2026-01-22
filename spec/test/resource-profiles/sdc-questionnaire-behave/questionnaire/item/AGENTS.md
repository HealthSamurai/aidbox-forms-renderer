## Element

```json
{
  "id": "Questionnaire.item",
  "path": "Questionnaire.item",
  "constraint": [
    {
      "key": "sdc-behave-2",
      "severity": "error",
      "human": "An item cannot have both enableWhen and enableWhenExpression",
      "expression": "enableWhen.empty() or extension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression').empty()",
      "xpath": "not(exists(f:enableWhen) and exists(f:extension[@url='http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression']))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-behave"
    },
    {
      "key": "sdc-behave-1",
      "severity": "error",
      "human": "An item cannot have both initial.value and initialExpression",
      "expression": "initial.empty() or extension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression').empty()",
      "xpath": "not(exists(f:initial) and exists(f:extension[@url='http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression']))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-behave"
    },
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bestpractice",
          "valueBoolean": true
        }
      ],
      "key": "sdc-behave-3",
      "severity": "warning",
      "human": "For items of type 'quantity', it is best practice to include either a 'unitOption' or 'unitValueSet' extension to provide a list of valid units.",
      "expression": "(type = 'quantity' implies (extension('http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption').exists() or extension('http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet').exists())) and (repeat(item).where(type = 'quantity')).all(extension('http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption').exists() or extension('http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet').exists())",
      "xpath": "(f:type/@value = 'quantity' implies (count(f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption']) > 0 or count(f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet']) > 0)) and not(.//f:item[f:type/@value = 'quantity' and not(f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption'] or f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet'])])",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-behave"
    }
  ]
}
```
