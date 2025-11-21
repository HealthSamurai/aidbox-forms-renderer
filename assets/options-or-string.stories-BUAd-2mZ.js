import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"boolean-wc-lookup-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!0,control:"lookup",answerConstraint:"optionsOrString",answerOption:u("boolean",[!0,!1])}),e=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/boolean/with item-control/lookup/repeating/with answer-options",component:r,parameters:i,argTypes:a},o={name:"options or string",args:{questionnaireSource:e},render:t=>s.jsx(r,{scenario:{name:"boolean-wc-lookup-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-lookup-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const b=["OptionsOrString"];export{o as OptionsOrString,b as __namedExportsOrder,f as default};
