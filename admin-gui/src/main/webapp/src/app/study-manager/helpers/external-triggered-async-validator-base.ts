import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {Directive, OnDestroy, OnInit} from "@angular/core";
import {Observable, skip, Subject, takeUntil} from "rxjs";

@Directive()
export abstract class ExternalTriggeredAsyncValidatorBase implements AsyncValidator, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private onValidatorChange: () => void = () => {};

    /**
     * Call this from the subclass constructor (or ngOnInit) to make the validator
     * re-run whenever an external observable emits.
     */
    protected reactToExternalChanges(
        trigger$: Observable<unknown>,
        options?: {skipFirst?: boolean},
    ): void {
        let stream$ = trigger$;

        // Optional: if your trigger$ emits an initial value you don't want to cause
        // an immediate revalidation, you can skip it.
        if (options?.skipFirst) {
            // Lazy import to keep the base minimal—remove if you prefer a normal import.
            stream$ = stream$.pipe(skip(1));
        }

        stream$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                console.log("External change detected, re-validating.");
                this.onValidatorChange();
            });
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onValidatorChange = fn;
    }

    /**
     * Subclasses still implement validate().
     */
    abstract validate(control: AbstractControl): Observable<ValidationErrors | null> | Promise<ValidationErrors | null>;

    /**
     * If your directive also implements OnDestroy, call super.ngOnDestroy().
     * (Angular will call ngOnDestroy on the directive instance if present.)
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}