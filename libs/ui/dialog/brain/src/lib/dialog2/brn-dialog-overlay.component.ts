import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Component({
	selector: 'brn-dialog-overlay',
	standalone: true,
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnDialogOverlayComponent {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	@Input()
	set class(newClass: string | null | undefined) {
		this._brnDialogRef.setOverlayClass(newClass);
	}

	setClassToCustomElement(newClass: string) {
		this._brnDialogRef.setOverlayClass(newClass);
	}
}
