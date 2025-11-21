import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"integer-wc-lookup-repeating-options-or-string",text:"Enter integer value",type:"integer",repeats:!0,control:"lookup",answerConstraint:"optionsOrString",answerOption:u("integer",[1,2,3])}),r=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/integer/with item-control/lookup/repeating/with answer-options",component:o,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:n=>i.jsx(o,{scenario:{name:"integer-wc-lookup-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-lookup-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
