import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"string-wc-spinner-non-repeating-options-or-string",text:"Enter text",type:"string",repeats:!1,control:"spinner",answerConstraint:"optionsOrString",answerOption:u("string",["Alpha","Bravo","Charlie"])}),n=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/string/with item-control/spinner/non-repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:n},render:o=>s.jsx(r,{scenario:{name:"string-wc-spinner-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:o.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-spinner-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
