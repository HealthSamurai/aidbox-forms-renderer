import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"decimal-wc-autocomplete-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrString",answerOption:p("decimal",[1.5,2,2.5])}),t=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/autocomplete/repeating/with answer-options",component:o,parameters:s,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"decimal-wc-autocomplete-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-autocomplete-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
