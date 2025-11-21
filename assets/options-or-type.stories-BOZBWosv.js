import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"string-wc-autocomplete-non-repeating-options-or-type",text:"Enter text",type:"string",repeats:!1,control:"autocomplete",answerConstraint:"optionsOrType",answerOption:u("string",["Alpha","Bravo","Charlie"])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/string/with item-control/autocomplete/non-repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"string-wc-autocomplete-non-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-autocomplete-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
