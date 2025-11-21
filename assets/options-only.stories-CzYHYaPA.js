import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=l({linkId:"boolean-wc-lookup-non-repeating-options-only",text:"Boolean question",type:"boolean",repeats:!1,control:"lookup",answerConstraint:"optionsOnly",answerOption:p("boolean",[!0,!1])}),e=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/boolean/with item-control/lookup/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},o={name:"options only",args:{questionnaireSource:e},render:r=>a.jsx(n,{scenario:{name:"boolean-wc-lookup-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-lookup-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const g=["OptionsOnly"];export{o as OptionsOnly,g as __namedExportsOrder,f as default};
