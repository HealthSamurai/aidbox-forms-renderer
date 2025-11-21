import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"string-wc-text-box-repeating-options-or-string",text:"Enter text",type:"string",repeats:!0,control:"text-box",answerConstraint:"optionsOrString",answerOption:u("string",["Alpha","Bravo","Charlie"])}),t=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/string/with item-control/text-box/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"string-wc-text-box-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-text-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,S as default};
