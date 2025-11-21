import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=l({linkId:"boolean-wc-autocomplete-non-repeating-options-only",text:"Boolean question",type:"boolean",repeats:!1,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:p("boolean",[!0,!1])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/boolean/with item-control/autocomplete/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:a=>r.jsx(n,{scenario:{name:"boolean-wc-autocomplete-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:a.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-autocomplete-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
