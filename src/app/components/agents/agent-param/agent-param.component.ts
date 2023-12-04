import { Component, Input, inject, signal } from '@angular/core';
import { Param } from 'src/app/models/param';
import { DataType } from 'src/app/models/data-type';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParamsService } from 'src/app/services/params.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { hexToRgb, parseParamValue } from 'src/app/utils/parsers';

@Component({
  selector: 'app-agent-param',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './agent-param.component.html',
  styleUrl: './agent-param.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentParamComponent {
  @Input({ alias: 'param', required: true }) set param_value(p: Param) {
    this.param.set(p);
    this.valueCtrl.setValue(parseParamValue(p), {
      emitEvent: false,
    });
  }

  private paramsService = inject(ParamsService);

  valueCtrl = new FormControl<any>({ value: null, disabled: false });

  param = signal<Param | null>(null);

  dataTypes = DataType;

  constructor() {
    this.valueCtrl.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(200))
      .subscribe((val) => {
        const param = this.param();
        if (param == null) {
          return;
        }
        if (param.dataType == DataType.RGB) {
          val = hexToRgb(val);
        }
        this.paramsService.update(param.id, val);
      });
  }

  getDataTypeName() {
    const type = this.param()?.dataType;
    if (type == null) {
      return '';
    }
    return DataType[type].toLowerCase();
  }
}
