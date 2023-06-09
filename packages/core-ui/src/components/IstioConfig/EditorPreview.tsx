import * as React from 'react';
import AceEditor from 'react-ace';
import * as jsYaml from 'js-yaml';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-eclipse';
import { aceOptions, AceValidations, AuthorizationPolicy, Sidecar } from '@kiali/types';

type PolicyItem = AuthorizationPolicy | Sidecar;

interface Props {
  yaml: string;
  onChange: (obj) => void;
  onCursorChange: (obj) => void;
}

interface State {
  yaml: string;
  parsedValidations: AceValidations;
}

export class EditorPreview extends React.Component<Props, State> {
  aceEditorRef: React.RefObject<AceEditor>;
  constructor(props: Props) {
    super(props);
    this.state = { yaml: this.props.yaml, parsedValidations: { markers: [], annotations: [] } };
    this.aceEditorRef = React.createRef();
  }

  onChange = (value: string) => {
    const parsedValidations: AceValidations = {
      markers: [],
      annotations: []
    };
    this.setState({ yaml: value });
    try {
      jsYaml.safeLoadAll(value, (object: PolicyItem) => {
        this.setState({ parsedValidations });
        this.props.onChange(object);
      });
    } catch (e) {
      const row = e.mark && e.mark.line ? e.mark.line : 0;
      const col = e.mark && e.mark.column ? e.mark.column : 0;
      const message = e.message ? e.message : '';
      parsedValidations.markers.push({
        startRow: row,
        startCol: 0,
        endRow: row + 1,
        endCol: 0,
        className: 'istio-validation-error',
        type: 'fullLine'
      });
      parsedValidations.annotations.push({
        row: row,
        column: col,
        type: 'error',
        text: message
      });
      this.setState({ parsedValidations });
    }
  };

  render() {
    return (
      <AceEditor
        ref={this.aceEditorRef}
        mode="yaml"
        theme="eclipse"
        onChange={value => this.onChange(value)}
        // height={`calc(var(--kiali-yaml-editor-height)`}
        width={'100%'}
        className={'istio-ace-editor'}
        wrapEnabled={true}
        setOptions={aceOptions}
        value={this.state.yaml}
        annotations={this.state.parsedValidations.annotations}
        markers={this.state.parsedValidations.markers}
        onCursorChange={this.props.onCursorChange}
      />
    );
  }
}
