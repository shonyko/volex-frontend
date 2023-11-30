import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Param } from 'src/app/models/param';
import { DataType } from 'src/app/models/data-type';
import { Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParamsService } from 'src/app/services/params.service';

@Component({
  selector: 'app-agent-param',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-param.component.html',
  styleUrl: './agent-param.component.scss',
})
export class AgentParamComponent {
  @Input({ alias: 'param', required: true }) param!: Param;

  private paramsService = inject(ParamsService);

  private update$ = new Subject<string>();

  dataTypes = DataType;

  constructor() {
    this.update$
      .pipe(takeUntilDestroyed(), debounceTime(200))
      .subscribe((val) => {
        this.paramsService.update(this.param.id, val);
      });
  }

  getDataTypeName(param: Param) {
    return DataType[param.dataType].toLowerCase();
  }

  // private toRGB(hex: any) {
  //   if (this.param.dataType != DataType.RGB) {
  //     return hex;
  //   }
  //   return hex;
  // }

  onChange(value: any) {
    this.update$.next(value);
  }
}
