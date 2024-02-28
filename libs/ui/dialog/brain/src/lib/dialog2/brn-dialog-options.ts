import { AutoFocusTarget } from '@angular/cdk/dialog';
import {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	PositionStrategy,
	ScrollStrategy,
} from '@angular/cdk/overlay';
import { ElementRef, StaticProvider } from '@angular/core';

export type BrnDialogOptions = {
	id: string;
	role: 'dialog' | 'alertdialog';
	hasBackdrop: boolean;
	panelClass: string | string[];
	backdropClass: string | string[];
	positionStrategy: PositionStrategy | null | undefined;
	scrollStrategy: ScrollStrategy | null | undefined;
	restoreFocus: boolean | string | ElementRef;
	closeDelay: number;
	closeOnOutsidePointerEvents: boolean;
	attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
	attachPositions: ConnectedPosition[];
	autoFocus: AutoFocusTarget | string;
	disableClose: boolean;
	ariaDescribedBy: string | null | undefined;
	ariaLabelledBy: string | null | undefined;
	ariaLabel: string | null | undefined;
	ariaModal: boolean;
	providers?: StaticProvider[] | (() => StaticProvider[]);
};
