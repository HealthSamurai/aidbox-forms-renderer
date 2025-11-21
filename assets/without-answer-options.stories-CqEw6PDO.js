import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const a=u({linkId:"attachment-wc-autocomplete-repeating-noopts",text:"Upload an attachment",type:"attachment",repeats:!0,control:"autocomplete"}),t=JSON.stringify(a.form.questionnaire,null,2),w={title:"Question/attachment/with item-control/autocomplete/repeating/without answer-options",component:o,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:t},render:n=>r.jsx(o,{scenario:{name:"attachment-wc-autocomplete-repeating-noopts",title:"without answer-options",build:()=>a},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-autocomplete-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
