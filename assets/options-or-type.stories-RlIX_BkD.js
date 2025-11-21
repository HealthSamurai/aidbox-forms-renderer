import{j as n}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"attachment-wc-autocomplete-repeating-options-or-type",text:"Upload an attachment",type:"attachment",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrType",answerOption:c("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),t=JSON.stringify(r.form.questionnaire,null,2),h={title:"Question/attachment/with item-control/autocomplete/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:t},render:a=>n.jsx(o,{scenario:{name:"attachment-wc-autocomplete-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:a.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-autocomplete-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const y=["OptionsOrType"];export{e as OptionsOrType,y as __namedExportsOrder,h as default};
