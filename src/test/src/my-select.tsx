import '@ionic/core';
import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'my-select',
  //   styleUrl: 'my-select.css',
})
export class MySelect {
  private ionSelect: HTMLIonSelectElement;
  private nativeInput: HTMLInputElement;

  @Prop() name: string;
  @Prop() required: boolean;

  componentWillLoad() {}

  componentDidLoad() {
    const that = this;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type == 'attributes') {
          console.log('BF attributes changed');
          //   if (that.nativeInput.hasAttribute('name')) {
          //     that.disableIonInput();
          //   }
        }
      });
    });

    const nativeInput = this.ionSelect.querySelector('input');
    observer.observe(nativeInput, {
      attributes: true, //configure it to listen to attribute changes
    });
  }

  componentDidRender() {
    this.disableIonInput();
  }

  private disableIonInput() {
    console.log(`BF disableIonInput`);
    if (!this.ionSelect) {
      return;
    }
    const nativeInput = this.ionSelect.querySelector('input');
    setTimeout(() => {
      this.ionSelect.removeChild(nativeInput);
    }, 0);
    // console.log(`BF disableIonInput`, { 'this.ionSelect': this.ionSelect, nativeInput });
    // nativeInput.disabled = true;
    // nativeInput.removeAttribute('name');
  }

  private onSelect = (e: CustomEvent<any>) => {
    console.log(`BF onSelect`, e.detail);
    this.nativeInput.value = e.detail.value;
    this.disableIonInput();
  };

  render() {
    this.disableIonInput();
    return (
      <Host>
        <ion-select ref={(el) => (this.ionSelect = el)} onIonChange={this.onSelect}>
          <ion-select-option value="red">red</ion-select-option>
          <ion-select-option value="blue">blue</ion-select-option>
        </ion-select>
        <input required={this.required} ref={(el) => (this.nativeInput = el)} name={this.name} />
      </Host>
    );
  }
}
