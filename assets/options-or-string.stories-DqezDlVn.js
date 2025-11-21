import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"boolean-woc-non-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!1,answerConstraint:"optionsOrString",answerOption:u("boolean",[!0,!1])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/boolean/without item-control/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:o},render:t=>s.jsx(n,{scenario:{name:"boolean-woc-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-woc-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,f as default};
