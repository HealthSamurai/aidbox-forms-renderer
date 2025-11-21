import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"boolean-wc-drop-down-non-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!1,control:"drop-down",answerConstraint:"optionsOrString",answerOption:u("boolean",[!0,!1])}),e=JSON.stringify(r.form.questionnaire,null,2),w={title:"Question/boolean/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},o={name:"options or string",args:{questionnaireSource:e},render:t=>s.jsx(n,{scenario:{name:"boolean-wc-drop-down-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-drop-down-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const f=["OptionsOrString"];export{o as OptionsOrString,f as __namedExportsOrder,w as default};
