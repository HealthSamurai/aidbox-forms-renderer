## Element

```json
{
  "id": "Questionnaire.jurisdiction",
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/structuredefinition-standards-status",
      "valueCode": "deprecated"
    }
  ],
  "path": "Questionnaire.jurisdiction",
  "short": "Intended jurisdiction for questionnaire (if applicable)",
  "definition": "A legal or geographic region in which the questionnaire is intended to be used.",
  "comment": "It may be possible for the questionnaire to be used in jurisdictions other than those for which it was originally designed or intended.\n\nDEPRECATION NOTE: For consistency, implementations are encouraged to migrate to using the new 'jurisdiction' code in the useContext element.  (I.e. useContext.code indicating http://terminology.hl7.org/CodeSystem/usage-context-type#jurisdiction and useContext.valueCodeableConcept indicating the jurisdiction.)",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "CodeableConcept"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "Jurisdiction"
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
        "valueBoolean": true
      }
    ],
    "strength": "extensible",
    "description": "Countries and regions within which this artifact is targeted for use.",
    "valueSet": "http://hl7.org/fhir/ValueSet/jurisdiction"
  },
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.jurisdiction"
    },
    {
      "identity": "rim",
      "map": "N/A (to add?)"
    }
  ]
}
```
