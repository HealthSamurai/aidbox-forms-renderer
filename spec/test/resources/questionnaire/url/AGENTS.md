## Element

```json
{
  "id": "Questionnaire.url",
  "path": "Questionnaire.url",
  "short": "Canonical identifier for this questionnaire, represented as an absolute URI (globally unique)",
  "definition": "An absolute URI that is used to identify this questionnaire when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this questionnaire is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the questionnaire is stored on different servers.",
  "comment": "Can be a urn:uuid: or a urn:oid: but real http: addresses are preferred.  Multiple instances may share the same URL if they have a distinct version.\n\nThe determination of when to create a new version of a resource (same url, new version) vs. defining a new artifact is up to the author.  Considerations for making this decision are found in [Technical and Business Versions](resource.html#versions).\n\nIn some cases, the resource can no longer be found at the stated url, but the url itself cannot change. Implementations can use the [meta.source](resource.html#meta) element to indicate where the current master source of the resource can be found.\n\nThe name of the referenced questionnaire can be conveyed using the http://hl7.org/fhir/StructureDefinition/display extension.",
  "requirements": "Allows the questionnaire to be referenced by a single globally unique identifier.\n\nThis is the id that will be used to link a QuestionnaireResponse to the Questionnaire the response is for.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "uri"
    }
  ],
  "constraint": [
    {
      "key": "cnl-1",
      "severity": "warning",
      "human": "URL should not contain | or # - these characters make processing canonical references problematic",
      "expression": "exists() implies matches('^[^|# ]+$')",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.url"
    },
    {
      "identity": "w5",
      "map": "FiveWs.identifier"
    },
    {
      "identity": "rim",
      "map": ".identifier[scope=BUSN;reliability=ISS]"
    }
  ]
}
```
