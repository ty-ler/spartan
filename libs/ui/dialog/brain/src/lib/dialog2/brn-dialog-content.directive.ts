import { Directive, inject, Input, TemplateRef } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';

@Directive({
	selector: '[brnDialogContent]',
	standalone: true,
})
export class BrnDialogContentDirective<T> {
	private readonly _brnDialog = inject(BrnDialogComponent, { optional: true });
	private readonly _template = inject(TemplateRef);

	constructor() {
		if (this._brnDialog) {
			this._brnDialog.registerTemplate(this._template);
		}
	}

	@Input()
	set class(newClass: string | null | undefined) {
		if (this._brnDialog) {
			this._brnDialog.setPanelClass(newClass);
		}
	}

	@Input()
	set context(context: T) {
		if (this._brnDialog) {
			this._brnDialog.setContext(context);
		}
	}
}
