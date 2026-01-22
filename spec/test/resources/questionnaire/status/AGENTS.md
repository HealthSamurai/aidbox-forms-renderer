## Element

```json
{
  "id": "Questionnaire.status",
  "path": "Questionnaire.status",
  "short": "draft | active | retired | unknown",
  "definition": "The current state of this questionnaire.",
  "comment": "A nominal state-transition diagram can be found in the] documentation\n\nUnknown does not represent 'other' - one of the defined statuses must apply.  Unknown is used when the authoring system is not sure what the current status is.\n\nSee guidance around (not) making local changes to elements [here](canonicalresource.html#localization).",
  "requirements": "Enables tracking the lifecycle of the content and filtering of questionnaires that are appropriate for use versus not.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "condition": ["que-1a"],
  "mustSupport": false,
  "isModifier": true,
  "isModifierReason": "This is labeled as \"Is Modifier\" because applications should not use a retired {{title}} without due consideration",
  "isSummary": true,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "PublicationStatus"
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
        "valueBoolean": true
      }
    ],
    "strength": "required",
    "description": "The lifecycle status of an artifact.",
    "valueSet": "http://hl7.org/fhir/ValueSet/publication-status|5.0.0"
  },
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.status"
    },
    {
      "identity": "w5",
      "map": "FiveWs.status"
    },
    {
      "identity": "rim",
      "map": ".status"
    }
  ]
}
```
