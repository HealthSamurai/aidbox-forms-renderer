import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"string-woc-non-repeating-options-or-string",text:"Enter text",type:"string",repeats:!1,answerConstraint:"optionsOrString",answerOption:u("string",["Alpha","Bravo","Charlie"])}),r=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/string/without item-control/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:r},render:o=>s.jsx(n,{scenario:{name:"string-woc-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-woc-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
