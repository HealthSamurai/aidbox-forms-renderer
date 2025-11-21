import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"string-wc-spinner-repeating-options-or-type",text:"Enter text",type:"string",repeats:!0,control:"spinner",answerConstraint:"optionsOrType",answerOption:u("string",["Alpha","Bravo","Charlie"])}),r=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/string/with item-control/spinner/repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:r},render:o=>s.jsx(t,{scenario:{name:"string-wc-spinner-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-spinner-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
